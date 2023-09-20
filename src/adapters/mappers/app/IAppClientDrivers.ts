import { IUIDriver } from '../ui/IUIDriver'
import { IFetcherDriver } from '../fetcher/IFetcherDriver'
import { IDatabaseDriver } from '../database/IDatabaseDriver'

export interface IAppClientDrivers {
  fetcher: IFetcherDriver
  ui: IUIDriver
  database: IDatabaseDriver
}
