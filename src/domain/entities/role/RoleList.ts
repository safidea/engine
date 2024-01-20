import type { IRole } from './IRole'
import { RoleEntity } from './RoleEntity'

export class RoleList {
  roles: RoleEntity[]

  constructor(public config: IRole[]) {
    this.roles = config.map((role) => new RoleEntity(role))
  }
}
