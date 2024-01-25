import type { Drivers } from '@domain/drivers'
import type { RoleList } from '../role/RoleList'
import type { Components } from '@domain/components'
import type { IServerInstance } from '@domain/drivers/IServer'

export interface IFeatureParams {
  roles: RoleList
  components: Components
  drivers: Drivers
  serverInstance?: IServerInstance
}
