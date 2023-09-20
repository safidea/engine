import { AppDto } from '@adapters/dtos/AppDto'
import { App } from '@entities/app/App'
import { IAppDrivers } from './IAppDrivers'
import { DatabaseMapper } from '../database/DatabaseMapper'
import { ConverterMapper } from '../converter/ConverterMapper'
import { FetcherMapper } from '../fetcher/FetcherMapper'
import { LoggerMapper } from '../logger/LoggerMapper'
import { StorageMapper } from '../storage/StorageMapper'
import { TemplaterMapper } from '../templater/TemplaterMapper'
import { UIMapper } from '../ui/UIMapper'

export class AppMapper {
  static toApp(dto: AppDto, drivers: IAppDrivers) {
    const mappers = {
      templater: new TemplaterMapper(drivers.templater),
      converter: new ConverterMapper(drivers.converter),
      storage: new StorageMapper(drivers.storage),
      database: new DatabaseMapper(drivers.database),
      fetcher: new FetcherMapper(drivers.fetcher),
      logger: new LoggerMapper(drivers.logger),
      ui: new UIMapper(drivers.ui),
    }
    return new App(dto, mappers)
  }
}
