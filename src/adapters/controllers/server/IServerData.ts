import { ConfigDto } from '@adapters/dtos/ConfigDto'
import { FetcherDrivers } from '@entities/services/fetcher/FetcherDrivers'
import { IconDrivers } from '@entities/services/icon/IconDrivers'
import { UIDrivers } from '@entities/services/ui/UIDrivers'

export interface IServerData {
  config: ConfigDto
  params: { [key: string]: string }
  drivers: {
    ui: UIDrivers
    icon: IconDrivers
    fetcher: FetcherDrivers
  }
  path: string
}
