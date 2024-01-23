import type { IServerInstance } from '@domain/drivers/IServer'
import type { ComponentList } from '../component/ComponentList'

export interface IPageParams {
  components: ComponentList
  server: IServerInstance
}
