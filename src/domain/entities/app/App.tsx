import type { Logger } from '@domain/services/Logger'
import type { Engine } from '../Engine'
import type { Server } from '@domain/services/Server'
import type { Database } from '@domain/services/Database'
import type { EngineError } from '../EngineError'
import type { Table } from '../table/Table'
import type { Page } from '../page/Page'
import type { Automation } from '../automation/Automation'
import type { Queue } from '@domain/services/Queue'

interface Params {
  name: string
  tables: Table[]
  pages: Page[]
  automations: Automation[]
  logger: Logger
  server: Server
  database?: Database
  queue?: Queue
}

export class App implements Engine {
  constructor(private params: Params) {}

  get name() {
    return this.params.name
  }

  validateConfig() {
    const { tables, pages, automations } = this.params
    const errors: EngineError[] = []
    errors.push(...tables.flatMap((table) => table.validateConfig()))
    errors.push(...pages.flatMap((page) => page.validateConfig()))
    errors.push(...automations.flatMap((automation) => automation.validateConfig()))
    return errors
  }

  start = async ({ isTest = false } = {}): Promise<string> => {
    const { server, database, queue } = this.params
    if (database) await database.migrate(this.params.tables)
    if (queue) await queue.start()
    const url = await server.start()
    if (!isTest) {
      process.on('SIGTERM', () => this.onClose('SIGTERM'))
      process.on('SIGINT', () => this.onClose('SIGINT'))
    }
    return url
  }

  stop = async (): Promise<void> => {
    const { server, database, queue } = this.params
    await server.stop(async () => {
      if (database) await database.disconnect()
      if (queue) await queue.stop()
    })
  }

  get running() {
    return this.params.server.isListening
  }

  get database() {
    return this.params.database
  }

  private onClose = async (signal: 'SIGTERM' | 'SIGINT') => {
    const { logger } = this.params
    logger.log(`received ${signal}`)
    await this.stop()
    process.exit(0)
  }
}
