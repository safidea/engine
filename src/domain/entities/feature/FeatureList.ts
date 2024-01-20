import type { IList } from '../IList'
import { FeatureEntity } from './FeatureEntity'
import type { IFeature } from './IFeature'
import type { IFeatureParams } from './IFeatureParams'

export class FeatureList implements IList<FeatureEntity> {
  features: FeatureEntity[]

  constructor(
    public config: IFeature[],
    params: IFeatureParams
  ) {
    this.features = config.map((feature) => new FeatureEntity(feature, params))
  }

  includes(name: string) {
    return this.features.some((feature) => feature.config.name === name)
  }

  find(name: string) {
    return this.features.find((feature) => feature.config.name === name)
  }
}
