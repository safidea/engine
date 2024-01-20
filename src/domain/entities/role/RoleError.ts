export { RoleNameRequiredError } from './errors/RoleNameRequiredError'
export { UnknownRolePropertyError } from './errors/UnknownRolePropertyError'

import type { RoleNameRequiredError } from './errors/RoleNameRequiredError'
import type { UnknownRolePropertyError } from './errors/UnknownRolePropertyError'

export type RoleError = RoleNameRequiredError | UnknownRolePropertyError
