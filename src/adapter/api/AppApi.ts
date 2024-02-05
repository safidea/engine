import { AppMapper, type Params as AppParams } from './mappers/AppMapper'
import type { App } from '@domain/entities/app/App'
import type { Params as SpisParams } from '@adapter/spi'
import { Api } from './Api'
import type { App as AppConfig } from './configs/App'
import type { EngineError } from '@domain/entities/EngineError'
import type { SpecError } from '@domain/entities/spec/SpecError'

export class AppApi extends Api<AppConfig, EngineError, App, AppParams> {
  private app?: App

  constructor(params: SpisParams) {
    super(params, AppMapper, 'app')
  }

  test = async (config: unknown): Promise<SpecError[]> => {
    if (!this.validate(config)) throw new Error('Invalid config')
    this.app = this.mapper.toEntityFromServices(config, this.services)
    return this.app.test()
  }

  start = async (config: unknown): Promise<string> => {
    if (!this.validate(config)) throw new Error('Invalid config')
    this.app = this.mapper.toEntityFromServices(config, this.services)
    return this.app.start()
  }

  stop = async (): Promise<void> => {
    if (this.app) await this.app.stop()
  }
}
