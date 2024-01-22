import type { ConfigError } from '../ConfigError'
import type { IList } from '../IList'
import { Feature } from './Feature'
import type { IFeature } from './IFeature'
import type { IFeatureParams } from './IFeatureParams'

export class FeatureList implements IList<Feature> {
  features: Feature[]
  errors: ConfigError[] = []

  constructor(
    public config: IFeature[],
    params: IFeatureParams
  ) {
    this.features = config.map((feature) => new Feature(feature, params))
    if (this.features.some((feature) => feature.errors.length)) {
      this.errors = this.features.flatMap((feature) => feature.errors)
    }
  }

  includes(name: string) {
    return this.features.some((feature) => feature.config.name === name)
  }

  find(name: string) {
    return this.features.find((feature) => feature.config.name === name)
  }
}
