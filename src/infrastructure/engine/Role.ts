import { RoleApi } from '@adapter/api/RoleApi'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export { RoleError } from '@domain/entities/role/RoleError'
export type { Role } from '@adapter/api/configs/Role'

class Role {
  constructor(private api: RoleApi) {}
  getErrors = (config: unknown) => this.api.getConfigErrors(config)
  validate = (config: unknown) => this.api.isValidConfig(config)
}

export default new Role(new RoleApi(drivers, components))
