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
}

export class App implements Base {
  constructor(private params: Params) {}

  get name() {
    return this.params.name
  }

  validateConfig() {
    const { tables, pages, automations } = this.params
    const errors: ConfigError[] = []
    errors.push(...tables.flatMap((table) => table.validateConfig()))
    errors.push(...pages.flatMap((page) => page.validateConfig()))
    errors.push(...automations.flatMap((automation) => automation.validateConfig()))
    return errors
  }

  start = async ({ isTest = false } = {}): Promise<string> => {
    const { server, database, queue, mailer, realtime } = this.params
    if (database) await database.migrate(this.params.tables)
    if (queue) await queue.start()
    if (mailer) await mailer.verify()
    if (realtime) await realtime.connect(this.params.tables)
    const url = await server.start()
    if (!isTest) {
      process.on('SIGTERM', () => this.onClose('SIGTERM'))
      process.on('SIGINT', () => this.onClose('SIGINT'))
    }
    return url
  }

  stop = async (): Promise<void> => {
    const { server, database, queue, mailer, realtime } = this.params
    await server.stop(async () => {
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
