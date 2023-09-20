import { IUIDriver } from '../ui/IUIDriver'
import { IFetcherDriver } from '../fetcher/IFetcherDriver'

export interface IAppClientDrivers {
  fetcher: IFetcherDriver
  ui: IUIDriver
}
