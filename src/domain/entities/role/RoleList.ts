import type { EngineList } from '../EngineList'
import { Role } from './Role'

export class RoleList implements EngineList<Role> {
  private roles: Role[]

  constructor(config: Role[]) {
    this.roles = config.map((role) => new Role(role))
  }

  get length() {
    return this.roles.length
  }

  get all() {
    return this.roles
  }

  validateConfig() {
    return this.roles.flatMap((role) => role.validateConfig())
  }

  includes(name: string) {
    return this.roles.some((role) => role.name === name)
  }

  find(name: string) {
    return this.roles.find((role) => role.name === name)
  }
}
