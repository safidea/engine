import { RoleEntity } from '@domain/entities/role/RoleEntity'
import { drivers } from '@drivers/index'
import { RoleError } from '@domain/entities/role/RoleError'

export class Role {
  errors: RoleError[] = []
  entity: RoleEntity | undefined

  constructor(public config: unknown) {
    const { jsonValidator } = drivers
    const { json, errors } = jsonValidator.validateRoleConfig(config)
    if (errors) {
      this.errors = errors
    } else {
      this.entity = new RoleEntity(json)
    }
  }
}

export type { IRole } from '@domain/entities/role/IRole'
export { RoleError }
