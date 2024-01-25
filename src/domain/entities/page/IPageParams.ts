import type { IServerInstance } from '@domain/drivers/IServer'
import type { Drivers } from '@domain/drivers'
import type { Components } from '@domain/components'

export interface IPageParams {
  components: Components
  server: IServerInstance
  drivers: Drivers
  featureName: string
}
