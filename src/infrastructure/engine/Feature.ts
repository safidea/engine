import { FeatureApi } from '@adapter/api/FeatureApi'
import type { EngineError } from '@domain/entities/EngineError'
import type { SpecError } from '@domain/entities/spec/SpecError'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export { FeatureError } from '@domain/entities/feature/FeatureError'
export type { Feature as Config } from '@adapter/api/configs/Feature'

export default class {
  private api: FeatureApi

  constructor(private config: unknown) {
    this.api = new FeatureApi({ drivers, components })
  }

  getErrors = (): EngineError[] => this.api.getErrors(this.config)

  test = async (): Promise<SpecError[]> => this.api.test(this.config)
}
