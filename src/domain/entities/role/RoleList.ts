import type { IList } from '../IList'
import type { IRole } from './IRole'
import { Role } from './Role'

export class RoleList implements IList<Role> {
  private roles: Role[]

  constructor(config: IRole[]) {
    this.roles = config.map((role) => new Role(role))
  }

  validateConfig() {
    return []
  }

  includes(name: string) {
    return this.roles.some((role) => role.name === name)
  }

  find(name: string) {
    return this.roles.find((role) => role.name === name)
  }
}
