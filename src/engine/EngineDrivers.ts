import { IConverterDrivers } from "@adapters/services/converter/IConverterDrivers";
import { IDatabaseDriver } from "@adapters/services/database/IDatabaseDriver";
import { IFetcherDriver } from "@adapters/services/fetcher/IFetcherDriver";
import { ILoggerDriver } from "@adapters/services/logger/ILoggerDriver";
import { IStorageDriver } from "@adapters/services/storage/IStorageDriver";
import { ITemplateDriver } from "@adapters/services/templater/ITemplaterDriver";
import { IUIDriver } from "@adapters/services/ui/IUIDriver";

export interface EngineDrivers {
  database: IDatabaseDriver
  storage: IStorageDriver
  templater: ITemplateDriver
  converter: IConverterDrivers
  fetcher: IFetcherDriver
  logger: ILoggerDriver
  ui: IUIDriver
}