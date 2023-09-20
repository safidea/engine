import fs from 'fs-extra'
import { getServerDriver } from '@drivers/server'
import { AppValidator } from '@adapters/validators/app/AppValidator'
import { AppMapper } from '@adapters/mappers/app/AppMapper'
import { getUIDriver } from '@drivers/ui'
import { getTemplaterDriver } from '@drivers/templater'
import { getConverterDrivers } from '@drivers/converter'
import { getStorageDriver } from '@drivers/storage'
import { getDatabaseDriver } from '@drivers/database'
import { getFetcherDriver } from '@drivers/fetcher'
import { getLoggerDriver } from '@drivers/logger'
import { EngineOptions } from './EngineOptions'
import { ServerController } from '@adapters/controllers/server/ServerController'
import { IAppServerDrivers } from '@adapters/mappers/app/IAppServerDrivers'

export default class Engine {
  private server: ServerController
  readonly drivers: IAppServerDrivers
  readonly folder: string
  readonly domain: string

  constructor(options: EngineOptions = {}) {
    this.folder = options.folder || process.cwd()
    this.domain = options.domain || `http://localhost:${options.port}`
    this.server = new ServerController(getServerDriver(options.server, { port: options.port }))
    const tmpFolder = `${this.folder}/tmp`
    fs.ensureDirSync(this.folder)
    fs.ensureDirSync(tmpFolder)
    this.drivers = {
      templater: getTemplaterDriver(options.templater),
      converter: getConverterDrivers(options.converter, { tmpFolder }),
      storage: getStorageDriver(options.storage, { folder: this.folder, domain: this.domain }),
      database: getDatabaseDriver(options.database, { folder: this.folder }),
      fetcher: getFetcherDriver(options.fetcher, { domain: this.domain }),
      logger: getLoggerDriver(options.logger),
      ui: getUIDriver(options.ui),
    }
  }

  async start(config: unknown): Promise<Engine> {
    const appConfig = AppValidator.validateConfig(config)
    const app = AppMapper.toServerApp(appConfig, this.drivers)
    await this.server.start(app)
    return this
  }

  async stop(): Promise<Engine> {
    await this.server.stop()
    return this
  }
}
