import { RoleMapper } from './mappers/RoleMapper'
import type { Role } from '@domain/entities/role/Role'
import { RoleError } from '@domain/entities/role/RoleError'
import type { Params as SpisParams } from '@adapter/spi'
import { Api } from './Api'
import type { Role as RoleConfig } from './configs/Role'

export class RoleApi extends Api<RoleConfig, RoleError, Role, undefined> {
  constructor(params: SpisParams) {
    super(params, RoleMapper, 'role')
  }
}
