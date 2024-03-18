import { AppMapper, type Params as AppParams } from './mappers/AppMapper'
import type { App } from '@domain/engine/App'
import type { Params as SpisParams } from '@adapter/spi'
import { Base } from './base'
import type { App as Config } from './configs/App'
import { FeatureMapper } from './mappers/FeatureMapper'
import type { TestError } from '@domain/entities/error/Test'

export class AppApi extends Base<Config, App, AppParams> {
  private app?: App

  constructor(params: SpisParams) {
    super(params, AppMapper, 'app')
  }

  test = async (config: unknown): Promise<TestError[]> => {
    const errors: TestError[] = []
    const { auth, features } = await this.validateConfigOrThrow(config)
    for (const featureConfig of features) {
      const feature = FeatureMapper.toEntityFromServices({ ...featureConfig, auth }, this.services)
      const newApp = async () =>
        AppMapper.featureToEntityFromServices({ ...featureConfig, auth }, this.services)
      const specErrors = await feature.test(newApp)
      errors.push(...specErrors)
    }
    return errors
  }

  start = async (config: unknown): Promise<string> => {
    this.app = await this.validateEngineOrThrow(config)
    return this.app.start()
  }

  stop = async (): Promise<void> => {
    if (this.app) await this.app.stop()
  }
}
