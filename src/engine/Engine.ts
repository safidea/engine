import { getServerDriver } from '@drivers/server'
import { ServerService } from '@adapters/services/server/ServerService'
import { AppValidator } from '@adapters/validators/app/AppValidator'
import { ConverterService } from '@adapters/services/converter/ConverterService'
import { DatabaseService } from '@adapters/services/database/DatabaseService'
import { FetcherService } from '@adapters/services/fetcher/FetcherService'
import { LoggerService } from '@adapters/services/logger/LoggerService'
import { StorageService } from '@adapters/services/storage/StorageService'
import { TemplaterService } from '@adapters/services/templater/TemplaterService'
import { UIService } from '@adapters/services/ui/UIService'
import { getUIDriver } from '@drivers/ui'
import { getTemplaterDriver } from '@drivers/templater'
import { getConverterDrivers } from '@drivers/converter'
import { getStorageDriver } from '@drivers/storage'
import { getDatabaseDriver } from '@drivers/database'
import { getFetcherDriver } from '@drivers/fetcher'
import { getLoggerDriver } from '@drivers/logger'
import { AppMapper } from '@adapters/mappers/AppMapper'
import { EngineOptions } from './EngineOptions'
import { EngineDrivers } from './EngineDrivers'
import { AppServices } from '@entities/app/AppServices'

export default class Engine {
  private server: ServerService
  private services: AppServices
  readonly drivers: EngineDrivers

  constructor(options: EngineOptions = {}) {
    const folder = options.folder || process.cwd()
    const domain = options.domain || `http://localhost:${options.port}`
    this.server = new ServerService(getServerDriver(options.server, { port: options.port }))
    this.drivers = {
      templater: getTemplaterDriver(options.templater),
      converter: getConverterDrivers(options.converter),
      storage: getStorageDriver(options.storage, { folder, domain }),
      database: getDatabaseDriver(options.database, { folder }),
      fetcher: getFetcherDriver(options.fetcher, { domain }),
      logger: getLoggerDriver(options.logger),
      ui: getUIDriver(options.ui),
    }
    this.services = {
      templater: new TemplaterService(this.drivers.templater),
      converter: new ConverterService(this.drivers.converter, folder),
      storage: new StorageService(this.drivers.storage),
      database: new DatabaseService(this.drivers.database),
      fetcher: new FetcherService(this.drivers.fetcher),
      logger: new LoggerService(this.drivers.logger),
      ui: new UIService(this.drivers.ui),
    }
  }

  async start(config: unknown): Promise<Engine> {
    const appConfig = AppValidator.validateConfig(config)
    const app = AppMapper.toApp(appConfig, this.services)
    await this.server.start(app)
    return this
  }

  async stop(): Promise<Engine> {
    await this.server.stop()
    return this
  }
}
