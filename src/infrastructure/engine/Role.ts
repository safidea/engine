import type { ApiOptions } from '@adapter/api/Api'
import { RoleApi } from '@adapter/api/RoleApi'
import type { RoleDto } from '@adapter/api/dtos/RoleDto'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export { RoleError } from '@domain/entities/role/RoleError'
export type { RoleDto as RoleConfig } from '@adapter/api/dtos/RoleDto'

export default class Role {
  api: RoleApi

  constructor(options?: ApiOptions) {
    this.api = new RoleApi(
      { ...drivers, ...options?.drivers },
      { ...components, ...options?.components }
    )
  }

  getConfigErrors = (config: unknown) => this.api.getConfigErrors(config)
  isValidConfig = (config: unknown) => this.api.isValidConfig(config)
  createFromConfig = (config: RoleDto) => this.api.createFromConfig(config)
}
