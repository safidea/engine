import fs from 'fs-extra'
import { ConfigDto as Config } from '@adapters/dtos/ConfigDto'
import { AutomationParams as Automation } from '@entities/app/automation/AutomationParams'
import { ActionParams as Action } from '@entities/app/automation/action/ActionParams'
import { TableParams as Table } from '@entities/app/table/TableParams'
import { FieldParams as Field } from '@entities/app/table/field/FieldParams'
import { PageParams as Page } from '@entities/app/page/PageParams'
import { BucketParams as Bucket } from '@entities/app/bucket/BucketParams'
import { ComponentParams as Component } from '@entities/app/page/component/ComponentParams'
import { ServerDrivers, getServerDriver } from '@drivers/server'
import { AppValidator } from '@adapters/validators/app/AppValidator'
import { AppMapper } from '@adapters/mappers/app/AppMapper'
import { getUIDriver } from '@drivers/ui'
import { TemplaterDrivers, getTemplaterDriver } from '@drivers/templater'
import { ConverterDrivers, getConverterDrivers } from '@drivers/converter'
import { StorageDrivers, getStorageDriver } from '@drivers/storage'
import { DatabaseDrivers, getDatabaseDriver } from '@drivers/database'
import { FetcherDrivers, getFetcherDriver } from '@drivers/fetcher'
import { LoggerDrivers, getLoggerDriver } from '@drivers/logger'
import { ServerController } from '@adapters/controllers/server/ServerController'
import { IAppServerDrivers } from '@adapters/mappers/app/IAppServerDrivers'
import { UIDrivers } from '@entities/services/ui/UIDrivers'

export type { Config, Page, Table, Automation, Action, Component, Field, Bucket }

export interface EngineOptions {
  server?: ServerDrivers
  templater?: TemplaterDrivers
  converter?: ConverterDrivers
  storage?: StorageDrivers
  database?: DatabaseDrivers
  fetcher?: FetcherDrivers
  logger?: LoggerDrivers
  ui?: UIDrivers
  folder?: string
  port?: number
  domain?: string
}

export default class Engine {
  private server: ServerController
  readonly drivers: IAppServerDrivers
  readonly folder: string
  readonly domain: string
  readonly port: number

  constructor(options: EngineOptions = {}) {
    this.folder = options.folder || process.cwd()
    this.port = options.port || 3000
    this.domain = options.domain || `http://localhost:${this.port}`
    this.server = new ServerController(getServerDriver(options.server, { port: this.port }))
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
    if (process.env.NODE_ENV === 'production') {
      const name = appConfig.name ? appConfig.name + ' app' : 'App'
      const message = `✨\n✨ ${name} listening on ${this.domain}\n✨`
      console.log(message)
    }
    return this
  }

  async stop(): Promise<Engine> {
    await this.server.stop()
    return this
  }
}
