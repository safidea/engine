import type { Logger } from '@domain/services/Logger'
import type { Server } from '@domain/services/Server'
import type { Database } from '@domain/services/Database'
import type { Table } from '../Table'
import type { Page } from '../Page'
import type { Bucket } from '../Bucket'
import type { Automation } from '../Automation'
import type { Queue } from '@domain/services/Queue'
import type { ConfigError } from '@domain/entities/Error/Config'
import type { Mailer } from '@domain/services/Mailer'
import type { Realtime } from '@domain/services/Realtime'
import type { Auth } from '@domain/services/Auth'
import type { Theme } from '@domain/services/Theme'
import type { Storage } from '@domain/services/Storage'
import { Get } from '@domain/entities/Request/Get'
import { State } from '../Page/State'

interface Params {
  name: string
  tables: Table[]
  pages: Page[]
  automations: Automation[]
  buckets: Bucket[]
  logger: Logger
  server: Server
  theme?: Theme
  database?: Database
  queue?: Queue
  mailer?: Mailer
  realtime?: Realtime
  auth?: Auth
  storage?: Storage
}

type Status = 'ready' | 'starting' | 'running' | 'stopping'

export class App {
  public name: string
  public database?: Database
  public storage?: Storage
  public queue?: Queue
  public mailer?: Mailer
  private _status: Status
  private _log: (message: string) => void

  constructor(private _params: Params) {
    const { logger } = _params
    this._log = logger.init('app')
    this._status = 'ready'
    this.name = _params.name
    this.database = _params.database
    this.queue = _params.queue
    this.storage = _params.storage
    this.mailer = _params.mailer
  }

  get running() {
    return this._params.server.isListening
  }

  get baseUrl() {
    return this._params.server.baseUrl
  }

  setStatus = (status: Status) => {
    this._log(`status: ${status}`)
    this._status = status
  }

  getTable = (name: string): Table => {
    const table = this._params.tables.find((table) => table.name === name)
    if (!table) throw new Error(`Table "${name}" not found`)
    return table
  }

  init = async (): Promise<void> => {
    const { tables, pages, automations, buckets, theme, server } = this._params
    await server.init(async () => {
      if (theme) {
        const getHtmlContent = (page: Page) =>
          page.htmlWithSampleProps(new State(new Get({ path: page.path, baseUrl: server.baseUrl })))
        const htmlContents = await Promise.all(pages.map(getHtmlContent))
        await theme.init(htmlContents)
      }
      for (const table of tables) await table.init()
      for (const automation of automations) await automation.init()
      for (const page of pages) await page.init()
      for (const bucket of buckets) await bucket.init()
    })
  }

  validateConfig = async (): Promise<ConfigError[]> => {
    await this.init()
    const { tables, pages, automations, buckets } = this._params
    const errors: Promise<ConfigError[]>[] = []
    errors.push(...tables.map((table) => table.validateConfig()))
    errors.push(...buckets.map((bucket) => bucket.validateConfig()))
    errors.push(...pages.map((page) => page.validateConfig()))
    errors.push(...automations.map((automation) => automation.validateConfig()))
    return Promise.all(errors).then((errors) => errors.flat())
  }

  start = async ({ isTest = false } = {}): Promise<string> => {
    if (this._status !== 'ready')
      throw new Error(`App is not ready, current status is ${this._status}`)
    this.setStatus('starting')
    const { tables, buckets, server, database, queue, storage, mailer, realtime, auth } =
      this._params
    if (database) {
      await database.connect()
      await database.migrate(tables)
      database.onError(async (error) => {
        if (this._status === 'running') {
          this._log(`database error: ${error.message}`)
          await this.stop({ graceful: false })
        }
      })
    }
    if (queue) await queue.start()
    if (storage) {
      await storage.connect()
      await storage.migrate(buckets)
    }
    if (mailer) await mailer.verify()
    if (realtime) await realtime.setup()
    if (auth) await auth.connect()
    const url = await server.start()
    if (!isTest && server.env === 'production') {
      process.on('SIGTERM', () => this._onClose('SIGTERM'))
      process.on('SIGINT', () => this._onClose('SIGINT'))
      process.on('uncaughtException', (err: Error) => {
        this._log(`uncaught exception: ${err.message}`)
        this._onClose('UNCAUGHT_EXCEPTION')
      })
    }
    this.setStatus('running')
    return url
  }

  stop = async (options?: { graceful?: boolean }): Promise<void> => {
    if (this._status !== 'running') return
    const { graceful = true } = options || {}
    this.setStatus('stopping')
    const { server, database, queue, mailer, auth } = this._params
    await server.stop(async () => {
      if (auth) await auth.disconnect()
      if (mailer) await mailer.close()
      if (queue) await queue.stop({ graceful })
      if (database) await database.disconnect()
    })
    this.setStatus('ready')
  }

  private _onClose = async (signal: 'SIGTERM' | 'SIGINT' | 'UNCAUGHT_EXCEPTION') => {
    this._log(`received ${signal}`)
    await this.stop()
    process.exit(1)
  }
}
