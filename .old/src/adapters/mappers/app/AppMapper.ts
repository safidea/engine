import { ConfigDto } from '@adapters/dtos/ConfigDto'
import { App } from '@entities/app/App'
import { DatabaseMapper } from '../database/DatabaseMapper'
import { ConverterMapper } from '../converter/ConverterMapper'
import { FetcherMapper } from '../fetcher/FetcherMapper'
import { LoggerMapper } from '../logger/LoggerMapper'
import { StorageMapper } from '../storage/StorageMapper'
import { TemplaterMapper } from '../templater/TemplaterMapper'
import { UIMapper } from '../ui/UIMapper'
import { IAppServerDrivers } from './IAppServerDrivers'
import { IAppClientDrivers } from './IAppClientDrivers'
import { IconMapper } from '../driver/IconMapper'

export class AppMapper {
  static toServerApp(dto: ConfigDto, drivers: IAppServerDrivers) {
    const mappers = {
      templater: new TemplaterMapper(drivers.templater),
      converter: new ConverterMapper(drivers.converter),
      storage: new StorageMapper(drivers.storage),
      database: new DatabaseMapper(drivers.database),
      fetcher: new FetcherMapper(drivers.fetcher),
      logger: new LoggerMapper(drivers.logger),
      ui: new UIMapper(drivers.ui),
      icon: new IconMapper(drivers.icon),
    }
    return new App(dto, mappers)
  }

  static toClientApp(dto: ConfigDto, drivers: IAppClientDrivers) {
    const mappers = {
      fetcher: new FetcherMapper(drivers.fetcher),
      ui: new UIMapper(drivers.ui),
      icon: new IconMapper(drivers.icon),
      database: {} as DatabaseMapper, // TODO: remove this line
    }
    return new App(dto, mappers)
  }
}
