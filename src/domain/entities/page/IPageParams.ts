import type { IServerInstance } from '@domain/drivers/IServer'
import type { Drivers } from '@domain/drivers'
import type { Components } from '@domain/components'

export interface IPageParamsShared {
  components: Components
  drivers: Drivers
  layoutPage?: React.FC<{ children: React.ReactNode }>
  timestamp?: number
}

export interface IPageParams extends IPageParamsShared {
  featureName: string
  serverInstance: IServerInstance
}
