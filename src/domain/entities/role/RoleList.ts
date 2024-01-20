import type { IList } from '../IList'
import type { IRole } from './IRole'
import { RoleEntity } from './RoleEntity'

export class RoleList implements IList<RoleEntity> {
  roles: RoleEntity[]

  constructor(public config: IRole[]) {
    this.roles = config.map((role) => new RoleEntity(role))
  }

  includes(name: string) {
    return this.roles.some((role) => role.config.name === name)
  }

  find(name: string) {
    return this.roles.find((role) => role.config.name === name)
  }
}
