import type { Logger } from '@domain/services/Logger'
import type { Engine } from '../Engine'
import type { Role } from '../role/Role'
import type { Server } from '@domain/services/Server'
import type { Database } from '@domain/services/Database'
import type { EngineError } from '../EngineError'
import type { SpecError } from '../spec/SpecError'
import type { Page } from '../page/Page'
import type { Table } from '../table/Table'
import type { Spec } from '../spec/Spec'

interface Params {
  name: string
  specs: Spec[]
  pages: Page[]
  tables: Table[]
  roles: Role[]
  logger: Logger
  server: Server
  database?: Database
}

export class App implements Engine {
  constructor(private params: Params) {
    process.on('SIGTERM', () => this.onClose('SIGTERM'))
    process.on('SIGINT', () => this.onClose('SIGINT'))
  }

  get name() {
    return this.params.name
  }

  validateConfig() {
    const errors: EngineError[] = []
    errors.push(...this.params.roles.map((role) => role.validateConfig()).flat())
    errors.push(...this.params.tables.map((table) => table.validateConfig()).flat())
    errors.push(...this.params.pages.map((page) => page.validateConfig()).flat())
    errors.push(...this.params.specs.map((spec) => spec.validateConfig()).flat())
    return errors
  }

  testSpecs = async (): Promise<SpecError[]> => {
    const errors: SpecError[] = []
    const results = await Promise.all(this.params.specs.map((spec) => spec.test()))
    for (const result of results) if (result) errors.push(result)
    return errors.flat()
  }

  start = async (): Promise<string> => {
    const { logger, server, database } = this.params
    logger.log(`starting server...`)
    if (database) await database.migrate()
    const url = await server.start()
    logger.log(`server started at ${url}`)
    return url
  }

  stop = async (): Promise<void> => {
    const { logger, server, database } = this.params
    logger.log(`closing server...`)
    await server.stop(async () => {
      if (database) await database.disconnect()
    })
    logger.log('server closed')
  }

  isRunning = (): boolean => {
    return this.params.server.isListening
  }

  private onClose = async (signal: 'SIGTERM' | 'SIGINT') => {
    const { logger } = this.params
    logger.log(`received ${signal}`)
    await this.stop()
    process.exit(0)
  }
}
