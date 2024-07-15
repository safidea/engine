import { AppMapper, type Params as AppParams } from './mappers/AppMapper'
import type { App } from '@domain/engine/App'
import type { Params as SpisParams } from '@adapter/spi'
import { BaseApi } from './BaseApi'
import type { App as Config } from './configs/App'
import type { TestError } from '@domain/entities/error/Test'

export class AppApi extends BaseApi<Config, App, AppParams> {
  private app?: App

  constructor(params: SpisParams) {
    super(params, AppMapper, 'app')
  }

  test = async (config: unknown): Promise<TestError[]> => {
    this.app = await this.validateOrThrow(config)
    return this.app.test()
  }

  start = async (config: unknown): Promise<string> => {
    this.app = await this.validateOrThrow(config)
    return this.app.start()
  }

  stop = async (): Promise<void> => {
    if (this.app) await this.app.stop()
  }
}
