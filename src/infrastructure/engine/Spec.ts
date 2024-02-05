import { SpecApi } from '@adapter/api/SpecApi'
import type { EngineError } from '@domain/entities/EngineError'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export { SpecError } from '@domain/entities/spec/SpecError'
export type { Spec as Config } from '@adapter/api/configs/spec/Spec'

export default class {
  private api: SpecApi

  constructor(private config: unknown) {
    this.api = new SpecApi({ drivers, components })
  }

  getErrors = (): EngineError[] => this.api.getErrors(this.config)
}
