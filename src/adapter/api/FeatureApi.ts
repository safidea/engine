import { type Drivers } from '@adapter/spi'
import { FeatureMapper } from './mappers/FeatureMapper'
import type { Feature } from '@domain/entities/feature/Feature'
import type { ReactComponents } from '@domain/entities/page/Component'
import { Api } from './Api'
import type { FeatureDto } from './dtos/FeatureDto'
import type { EngineError } from '@domain/entities/EngineError'

export class FeatureApi extends Api<FeatureDto, EngineError, Feature> {
  constructor(drivers: Drivers, components: ReactComponents) {
    super(drivers, components, FeatureMapper, 'feature')
  }
}
