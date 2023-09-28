import { ConfigDto } from '@adapters/dtos/ConfigDto'
import { FetcherDrivers } from '@entities/services/fetcher/FetcherDrivers'
import { UIDrivers } from '@entities/services/ui/UIDrivers'

export interface IServerData {
  config: ConfigDto
  params: { [key: string]: string }
  drivers: {
    ui: UIDrivers
    fetcher: FetcherDrivers
  }
  path: string
}
