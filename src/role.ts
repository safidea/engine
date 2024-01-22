import { Role } from '@domain/entities/role/Role'
import { drivers } from '@drivers/index'
import { RoleError } from '@domain/entities/role/RoleError'

export function createRole(
  config: unknown
): { errors: RoleError[]; role: undefined } | { role: Role; errors: undefined } {
  const { jsonValidator } = drivers
  const { json, errors } = jsonValidator.validateRoleConfig(config)
  if (errors) {
    return { errors, role: undefined }
  } else {
    const role = new Role(json)
    const errors = role.validateConfig()
    if (errors.length) {
      return { errors, role: undefined }
    }
    return { role, errors: undefined }
  }
}

export type { IRole } from '@domain/entities/role/IRole'
export { RoleError }
