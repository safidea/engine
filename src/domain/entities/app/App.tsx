import type { Logger } from '@domain/services/Logger'
import type { Engine } from '../Engine'
import type { Role } from '../role/Role'
import type { Server } from '@domain/services/Server'
import type { Database } from '@domain/services/Database'
import type { EngineError } from '../EngineError'
import type { SpecError } from '../spec/SpecError'
import type { Feature } from '../feature/Feature'
import { Json } from '@domain/services/Response/Json'

interface Params {
  name: string
  features: Feature[]
  roles: Role[]
  logger: Logger
  server: Server
  database?: Database
}

export class App implements Engine {
  constructor(private params: Params) {
    const { server } = params
    process.on('SIGTERM', () => this.onClose('SIGTERM'))
    process.on('SIGINT', () => this.onClose('SIGINT'))
    server.get('/health', async () => new Json({ success: true }))
  }

  get name() {
    return this.params.name
  }

  validateConfig() {
    const errors: EngineError[] = []
    errors.push(...this.params.roles.map((role) => role.validateConfig()).flat())
    errors.push(...this.params.features.map((feature) => feature.validateConfig()).flat())
    return errors
  }

  test = async (): Promise<SpecError[]> => {
    const { logger, features } = this.params
    let errors: SpecError[] = []
    logger.log(`start testing features specs...`)
    const results = await Promise.all(features.map((feature) => feature.test()))
    for (const result of results.flat()) if (result) errors.push(result)
    errors = errors.flat()
    logger.log(`finish testing features specs with ${errors.length} error(s)`)
    return errors
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
