import type { ApiOptions } from '@adapter/api/Api'
import { RoleApi } from '@adapter/api/RoleApi'
import type { Role } from '@adapter/api/configs/Role'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export { RoleError } from '@domain/entities/role/RoleError'
export type { Role } from '@adapter/api/configs/Role'

export default class {
  api: RoleApi

  constructor(options?: ApiOptions) {
    this.api = new RoleApi(
      { ...drivers, ...options?.drivers },
      { ...components, ...options?.components }
    )
  }

  getConfigErrors = (config: unknown) => this.api.getConfigErrors(config)
  isValidConfig = (config: unknown) => this.api.isValidConfig(config)
  createFromConfig = (config: Role) => this.api.createFromConfig(config)
}
