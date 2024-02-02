import { type Drivers } from '@adapter/spi'
import { RoleMapper } from './mappers/RoleMapper'
import type { Role } from '@domain/entities/role/Role'
import { RoleError } from '@domain/entities/role/RoleError'
import type { ReactComponents } from '@domain/entities/page/Component'
import { Api } from './Api'
import type { RoleDto } from './dtos/RoleDto'

export class RoleApi extends Api<RoleDto, RoleError, Role> {
  constructor(drivers: Drivers, components: ReactComponents) {
    super(drivers, components, RoleMapper, 'role')
  }
}
