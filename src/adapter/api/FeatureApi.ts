import { type Drivers } from '@adapter/spi'
import { FeatureMapper, type Params } from './mappers/FeatureMapper'
import type { Feature } from '@domain/entities/feature/Feature'
import type { ReactComponents } from '@domain/entities/page/Component'
import { Api } from './Api'
import type { Feature as FeatureConfig } from './configs/Feature'
import type { EngineError } from '@domain/entities/EngineError'

export class FeatureApi extends Api<FeatureConfig, EngineError, Feature, Params> {
  constructor(drivers: Drivers, components: ReactComponents) {
    super(drivers, components, FeatureMapper, 'feature')
  }
}
