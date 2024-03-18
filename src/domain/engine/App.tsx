import type { Logger } from '@domain/services/Logger'
import type { Base } from './base'
import type { Server } from '@domain/services/Server'
import type { Database } from '@domain/services/Database'
import type { Table } from './table/Table'
import type { Page } from './page/Page'
import type { Automation } from './automation/Automation'
import type { Queue } from '@domain/services/Queue'
import type { ConfigError } from '@domain/entities/error/Config'
import type { Mailer } from '@domain/services/Mailer'
import type { Realtime } from '@domain/services/Realtime'
import type { Auth } from '@domain/services/Auth'

interface Params {
  name: string
  tables: Table[]
  pages: Page[]
  automations: Automation[]
  logger: Logger
  server: Server
  database?: Database
  queue?: Queue
  mailer?: Mailer
  realtime?: Realtime
  auth?: Auth
}

export class App implements Base {
  constructor(private params: Params) {}

  get name() {
    return this.params.name
  }

  init = async () => {
    const { tables, pages, automations } = this.params
    for (const table of tables) await table.init()
    for (const automation of automations) await automation.init()
    for (const page of pages) await page.init()
  }

  validateConfig = async () => {
    await this.init()
    const { tables, pages, automations } = this.params
    const errors: Promise<ConfigError[]>[] = []
    errors.push(...tables.map((table) => table.validateConfig()))
    errors.push(...pages.map((page) => page.validateConfig()))
    errors.push(...automations.map((automation) => automation.validateConfig()))
    return Promise.all(errors).then((errors) => errors.flat())
  }

  start = async ({ isTest = false } = {}): Promise<string> => {
    await this.validateConfig()
    const { server, database, queue, mailer, realtime, auth } = this.params
    if (database) await database.migrate(this.params.tables)
    if (queue) await queue.start()
    if (mailer) await mailer.verify()
    if (realtime) await realtime.connect(this.params.tables)
    if (auth) await auth.connect()
    const url = await server.start()
    if (!isTest && process.env.NODE_ENV === 'production') {
      process.on('SIGTERM', () => this.onClose('SIGTERM'))
      process.on('SIGINT', () => this.onClose('SIGINT'))
    }
    return url
  }

  stop = async (): Promise<void> => {
    const { server, database, queue, mailer, realtime, auth } = this.params
    await server.stop(async () => {
      if (auth) await auth.disconnect()
      if (realtime) await realtime.disconnect()
      if (mailer) await mailer.close()
      if (queue) await queue.stop()
      if (database) await database.disconnect()
    })
  }

  get running() {
    return this.params.server.isListening
  }

  get database() {
    return this.params.database
  }

  get queue() {
    return this.params.queue
  }

  get mailer() {
    return this.params.mailer
  }

  private onClose = async (signal: 'SIGTERM' | 'SIGINT') => {
    const { logger } = this.params
    logger.log(`received ${signal}`)
    await this.stop()
    process.exit(0)
  }
}
