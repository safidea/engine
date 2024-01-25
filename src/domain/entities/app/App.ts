import type { IServerInstance } from '@domain/drivers/IServer'
import type { EngineError } from '../EngineError'
import type { IEntity } from '../IEntity'
import { FeatureList } from '../feature/FeatureList'
import { RoleList } from '../role/RoleList'
import type { IApp } from './IApp'
import type { IAppParams } from './IAppParams'

export class App implements IEntity {
  name: string
  private roles: RoleList
  private features: FeatureList
  private server: IServerInstance

  constructor(config: IApp, params: IAppParams) {
    const { drivers } = params
    this.name = config.name
    this.server = drivers.server.create()
    this.roles = new RoleList(config.roles ?? [])
    this.features = new FeatureList(config.features, {
      roles: this.roles,
      components: params.components,
      drivers: params.drivers,
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
    return this.server.start()
  }

  async stop(): Promise<void> {
    await this.server.stop()
  }

  isRunning(): boolean {
    return this.server.isListening()
  }
}
