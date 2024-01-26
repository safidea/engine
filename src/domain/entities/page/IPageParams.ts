import type { IServerInstance } from '@domain/drivers/IServer'
import type { Drivers } from '@domain/drivers'
import type { Components } from '@domain/components'
import type { PageProps } from '@domain/components/base/Page'

export interface IPageParamsShared {
  components: Components
  drivers: Drivers
  layoutPage?: (props: PageProps) => JSX.Element
}

export interface IPageParams extends IPageParamsShared {
  featureName: string
  serverInstance: IServerInstance
}
