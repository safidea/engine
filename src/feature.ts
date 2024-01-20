import { FeatureEntity } from '@domain/entities/feature/FeatureEntity'
import { drivers } from '@drivers/index'
import { FeatureError } from '@domain/entities/feature/FeatureError'

export class Feature {
  errors: FeatureError[] = []
  entity: FeatureEntity | undefined

  constructor(public config: unknown) {
    const { jsonValidator } = drivers
    const { json, errors } = jsonValidator.validateFeatureConfig(config)
    if (errors) {
      this.errors = errors
    } else {
      this.entity = new FeatureEntity(json)
    }
  }
}

export type { IFeature } from '@domain/entities/feature/IFeature'
export { FeatureError }
