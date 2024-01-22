import type { IList } from '../IList'
import { Feature } from './Feature'
import type { IFeature } from './IFeature'
import type { IFeatureParams } from './IFeatureParams'

export class FeatureList implements IList<Feature> {
  private features: Feature[]

  constructor(config: IFeature[], params: IFeatureParams) {
    this.features = config.map((feature) => new Feature(feature, params))
  }

  validateConfig() {
    return this.features.flatMap((feature) => feature.validateConfig())
  }

  includes(name: string) {
    return this.features.some((feature) => feature.name === name)
  }

  find(name: string) {
    return this.features.find((feature) => feature.name === name)
  }
}
