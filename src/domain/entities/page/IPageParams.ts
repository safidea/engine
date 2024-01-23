import type { IServerInstance } from '@domain/drivers/IServer'
import type { ComponentList } from '../component/ComponentList'
import type { Drivers } from '@domain/drivers'

export interface IPageParams {
  components: ComponentList
  server: IServerInstance
  drivers: Drivers
}
