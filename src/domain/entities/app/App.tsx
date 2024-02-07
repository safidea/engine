import type { Logger } from '@domain/services/Logger'
import type { Engine } from '../Engine'
import type { Server } from '@domain/services/Server'
import type { Database } from '@domain/services/Database'
import type { EngineError } from '../EngineError'
import type { Table } from '../table/Table'
import type { Page } from '../page/Page'

interface Params {
  name: string
  tables: Table[]
  pages: Page[]
  logger: Logger
  server: Server
  database?: Database
}

export class App implements Engine {
  constructor(private params: Params) {}

  get name() {
    return this.params.name
  }

  validateConfig() {
    const { tables, pages } = this.params
    const errors: EngineError[] = []
    errors.push(...tables.flatMap((table) => table.validateConfig()))
    errors.push(...pages.flatMap((page) => page.validateConfig()))
    return errors
  }

  start = async ({ isTest = false } = {}): Promise<string> => {
    const { server, database } = this.params
    if (database) await database.migrate(this.params.tables)
    const url = await server.start()
    if (!isTest) {
      process.on('SIGTERM', () => this.onClose('SIGTERM'))
      process.on('SIGINT', () => this.onClose('SIGINT'))
    }
    return url
  }

  stop = async (): Promise<void> => {
    const { server, database } = this.params
    await server.stop(async () => {
      if (database) await database.disconnect()
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
