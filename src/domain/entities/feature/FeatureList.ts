import type { EngineList } from '../EngineList'
import type { SpecError } from '../spec/SpecError'
import { Feature, type FeatureConfig, type FeatureParams } from './Feature'

export class FeatureList implements EngineList<Feature> {
  private features: Feature[]

  constructor(config: FeatureConfig[], params: FeatureParams) {
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

  hasPages() {
    return this.features.some((feature) => feature.hasPages())
  }

  mergeTables() {
    return this.features.flatMap((feature) => feature.getTables())
  }

  mergePages() {
    return this.features.flatMap((feature) => feature.getPages())
  }
}
