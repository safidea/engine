import type { ApiOptions } from '@adapter/api/Api'
import { SpecApi } from '@adapter/api/SpecApi'
import type { SpecDto } from '@adapter/api/dtos/spec/SpecDto'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export { SpecError } from '@domain/entities/spec/SpecError'
export type { SpecDto as SpecConfig } from '@adapter/api/dtos/spec/SpecDto'

export default class Spec {
  api: SpecApi

  constructor(options?: ApiOptions) {
    this.api = new SpecApi(
      { ...drivers, ...options?.drivers },
      { ...components, ...options?.components }
    )
  }

  getConfigErrors = (config: unknown) => this.api.getConfigErrors(config)
  isValidConfig = (config: unknown) => this.api.isValidConfig(config)
  createFromConfig = (config: SpecDto) => this.api.createFromConfig(config)
}
