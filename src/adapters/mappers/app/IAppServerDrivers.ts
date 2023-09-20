import { IUIDriver } from '../ui/IUIDriver'
import { IConverterDrivers } from '../converter/IConverterDrivers'
import { IDatabaseDriver } from '../database/IDatabaseDriver'
import { IFetcherDriver } from '../fetcher/IFetcherDriver'
import { ILoggerDriver } from '../logger/ILoggerDriver'
import { IStorageDriver } from '../storage/IStorageDriver'
import { ITemplateDriver } from '../templater/ITemplaterDriver'

export interface IAppServerDrivers {
  database: IDatabaseDriver
  storage: IStorageDriver
  templater: ITemplateDriver
  converter: IConverterDrivers
  fetcher: IFetcherDriver
  logger: ILoggerDriver
  ui: IUIDriver
}
