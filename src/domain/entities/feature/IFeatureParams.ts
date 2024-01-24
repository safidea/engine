import type { Drivers } from '@domain/drivers'
import type { RoleList } from '../role/RoleList'
import type { Components } from '@domain/components'

export interface IFeatureParams {
  roles: RoleList
  components: Components
  drivers: Drivers
}
