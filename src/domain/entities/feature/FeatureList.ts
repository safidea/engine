import type { IList } from '../IList'
import type { SpecError } from '../spec/SpecError'
import { TableList } from '../table/TableList'
import { Feature } from './Feature'
import type { IFeature } from './IFeature'
import type { IFeatureParams } from './IFeatureParams'

export class FeatureList implements IList<Feature> {
  private features: Feature[]

  constructor(
    private config: IFeature[],
    private params: IFeatureParams
  ) {
    this.features = config.map((feature) => new Feature(feature, params))
  }

  async testSpecs(): Promise<SpecError[]> {
    const errors: SpecError[] = []
    for (const feature of this.features) {
      errors.push(...(await feature.testSpecs()))
    }
    return errors
  }

  get length() {
    return this.features.length
  }

  get all() {
    return this.features
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

  hasTables() {
    return this.features.some((feature) => feature.hasTables())
  }

  mergeTables() {
    const tables = this.config.flatMap((feature) => feature.tables ?? [])
    return new TableList(tables, {
      drivers: this.params.drivers,
      featureName: 'all',
    })
  }
}
