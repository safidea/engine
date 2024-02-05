import { FeatureApi } from '@adapter/api/FeatureApi'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export { FeatureError } from '@domain/entities/feature/FeatureError'
export type { Feature } from '@adapter/api/configs/Feature'

class Feature {
  constructor(private api: FeatureApi) {}
  getErrors = (config: unknown) => this.api.getConfigErrors(config)
  validate = (config: unknown) => this.api.isValidConfig(config)
}

export default new Feature(new FeatureApi(drivers, components))
