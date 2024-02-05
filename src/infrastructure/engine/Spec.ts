import type { ApiOptions } from '@adapter/api/Api'
import { SpecApi } from '@adapter/api/SpecApi'
import type { Spec } from '@adapter/api/configs/spec/Spec'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export { SpecError } from '@domain/entities/spec/SpecError'
export type { Spec } from '@adapter/api/configs/spec/Spec'

export default class {
  api: SpecApi

  constructor(options?: ApiOptions) {
    this.api = new SpecApi(
      { ...drivers, ...options?.drivers },
      { ...components, ...options?.components }
    )
  }

  getConfigErrors = (config: unknown) => this.api.getConfigErrors(config)
  isValidConfig = (config: unknown) => this.api.isValidConfig(config)
  createFromConfig = (config: Spec) => this.api.createFromConfig(config)
}
