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
import type { Monitor } from '@domain/services/Monitor'

export interface Config {
  name: string
}

export interface Services {
  logger: Logger
  server: Server
  theme: Theme
  database: Database
  queue: Queue
  mailer: Mailer
  realtime: Realtime
  auth: Auth
  storage: Storage
  monitor: Monitor
}

export interface Entities {
  tables: Table[]
  pages: Page[]
  automations: Automation[]
  buckets: Bucket[]
}

type Status = 'ready' | 'starting' | 'running' | 'stopping'

export class App {
  public name: string
  public database: Database
  public storage: Storage
  public queue: Queue
  public mailer: Mailer
  public status: Status = 'ready'

  constructor(
    config: Config,
    private _services: Services,
    private _entities: Entities
  ) {
    const { name } = config
    const { database, queue, mailer, storage } = _services
    this.name = name
    this.database = database
    this.queue = queue
    this.storage = storage
    this.mailer = mailer
  }

  get running() {
    return this._services.server.isListening
  }

  get baseUrl() {
    return this._services.server.baseUrl
  }

  setStatus = (status: Status) => {
    this._services.logger.debug(`set app status: ${status}`)
    this.status = status
  }

  getTable = (name: string): Table => {
    const table = this._entities.tables.find((table) => table.name === name)
    if (!table) throw new Error(`table "${name}" not found`)
    return table
  }

  init = async (): Promise<void> => {
    const { theme, server, logger } = this._services
    const { tables, pages, automations, buckets } = this._entities
    await logger.init()
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
    const { tables, pages, automations, buckets } = this._entities
    const errors: Promise<ConfigError[]>[] = []
    errors.push(...tables.map((table) => table.validateConfig()))
    errors.push(...buckets.map((bucket) => bucket.validateConfig()))
    errors.push(...pages.map((page) => page.validateConfig()))
    errors.push(...automations.map((automation) => automation.validateConfig()))
    return Promise.all(errors).then((errors) => errors.flat())
  }

  start = async ({ isTest = false } = {}): Promise<string> => {
    if (this.status !== 'ready')
      throw new Error(`App is not ready, current status is ${this.status}`)
    this.setStatus('starting')
    const { server, database, queue, storage, mailer, realtime, logger, monitor } = this._services
    const { tables, buckets } = this._entities
    await database.connect()
    await database.migrate(tables)
    database.onError(async () => {
      if (this.status === 'running') {
        await this.stop({ graceful: false })
      }
    })
    await queue.start()
    await storage.connect()
    await storage.migrate(buckets)
    await mailer.verify()
    await realtime.setup()
    const url = await server.start()
    if (!isTest && server.env === 'production') {
      process.on('SIGTERM', () => this._onClose('SIGTERM'))
      process.on('SIGINT', () => this._onClose('SIGINT'))
      process.on('uncaughtException', (error: Error) => {
        logger.error(`uncaught exception: ${error.message}`)
        monitor.captureException(error)
        this._onClose('UNCAUGHT_EXCEPTION')
      })
      process.on('unhandledRejection', (reason: Error, promise) => {
        logger.error(`uncaught rejection at: ${promise} 
          reason: ${reason}`)
        monitor.captureException(reason)
        this._onClose('UNCAUGHT_REJECTION')
      })
    }
    logger.info(`app "${this.name}" started at ${url}`)
    this.setStatus('running')
    return url
  }

  stop = async (options?: { graceful?: boolean }): Promise<void> => {
    if (this.status !== 'running') return
    const { graceful = true } = options || {}
    this.setStatus('stopping')
    const { server, database, queue, mailer } = this._services
    await server.stop(async () => {
      await mailer.close()
      await queue.stop({ graceful })
      await database.disconnect()
    })
    this.setStatus('ready')
  }

  private _onClose = async (
    signal: 'SIGTERM' | 'SIGINT' | 'UNCAUGHT_EXCEPTION' | 'UNCAUGHT_REJECTION'
  ) => {
    this._services.logger.debug(`app received signal ${signal}`)
    await this.stop()
    process.exit(1)
  }
}
