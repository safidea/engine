import type { IServerInstance } from '@domain/drivers/IServer'
import type { EngineError } from '../EngineError'
import type { IEntity } from '../IEntity'
import { FeatureList } from '../feature/FeatureList'
import { RoleList } from '../role/RoleList'
import type { IApp } from './IApp'
import type { IAppParams } from './IAppParams'
import type { ILoggerLog } from '@domain/drivers/ILogger'

export class App implements IEntity {
  name: string
  private roles: RoleList
  private features: FeatureList
  private server: IServerInstance
  private log: ILoggerLog

  constructor(config: IApp, params: IAppParams) {
    const { drivers, components } = params
    const { server, logger } = drivers
    this.name = config.name
    this.server = server.create()
    this.log = logger.init('app:' + logger.slug(this.name))
    this.roles = new RoleList(config.roles ?? [])
    this.features = new FeatureList(config.features, {
      roles: this.roles,
      components,
      drivers,
    })
  }

  validateConfig() {
    const errors: EngineError[] = []
    errors.push(...this.roles.validateConfig())
    errors.push(...this.features.validateConfig())
    return errors
  }

  async testFeaturesSpecs() {
    return this.features.testSpecs()
  }

  async start(): Promise<string> {
    const url = await this.server.start()
    this.log(`server started at ${url}`)
    return url
  }

  async stop(): Promise<void> {
    await this.server.stop()
    this.log(`server stopped`)
  }

  isRunning(): boolean {
    return this.server.isListening()
  }
}
