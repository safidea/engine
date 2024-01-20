import { FeatureEntity } from './FeatureEntity'
import type { IFeature } from './IFeature'

export class FeatureList {
  features: FeatureEntity[]

  constructor(public config: IFeature[]) {
    this.features = config.map((feature) => new FeatureEntity(feature))
  }
}
