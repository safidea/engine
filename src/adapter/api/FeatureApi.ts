import { FeatureMapper, type Params } from './mappers/FeatureMapper'
import { Feature } from '@domain/entities/feature/Feature'
import type { Params as SpisParams } from '@adapter/spi'
import { Api } from './Api'
import type { Feature as FeatureConfig } from './configs/Feature'
import type { EngineError } from '@domain/entities/EngineError'
import type { SpecError } from '@infrastructure/engine/spec'
import { AppMapper } from './mappers/AppMapper'

export class FeatureApi extends Api<FeatureConfig, EngineError, Feature, Params> {
  constructor(params: SpisParams) {
    super(params, FeatureMapper, 'feature')
  }

  test = async (config: unknown): Promise<SpecError[]> => {
    if (!this.validate(config)) throw new Error('Invalid config')
    const feature = this.mapper.toEntityFromServices(config, this.services)
    return feature.test(() => AppMapper.featureToEntityFromServices(config, this.services))
  }
}
