import { IUIDriver } from '../ui/IUIDriver'
import { IFetcherDriver } from '../fetcher/IFetcherDriver'
import { IIconDriver } from '../driver/IIconDriver'

export interface IAppClientDrivers {
  fetcher: IFetcherDriver
  ui: IUIDriver
  icon: IIconDriver
}
