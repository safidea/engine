import { ServerDrivers, getServerDriver } from '@drivers/server'
import { App, AppServices } from '@entities/app/App'
import { Automation } from '@entities/app/automation/Automation'
import { Action } from '@entities/app/automation/action/Action'
import { Table } from '@entities/app/table/Table'
import { Field } from '@entities/app/table/field/Field'
import { Page } from '@entities/app/page/Page'
import { Component } from '@entities/app/page/component/Component'
import { ServerService } from '@adapters/services/server/ServerService'
import { AppValidator } from '@adapters/validators/AppValidator'
import { ConverterService } from '@adapters/services/converter/ConverterService'
import { DatabaseService } from '@adapters/services/database/DatabaseService'
import { FetcherService } from '@adapters/services/fetcher/FetcherService'
import { LoggerService } from '@adapters/services/logger/LoggerService'
import { StorageService } from '@adapters/services/storage/StorageService'
import { TemplaterService } from '@adapters/services/templater/TemplaterService'
import { UIService } from '@adapters/services/ui/UIService'
import { getUIDriver } from '@drivers/ui'
import { TemplaterDrivers, getTemplaterDriver } from '@drivers/templater'
import { ConverterDrivers, getConverterDrivers } from '@drivers/converter'
import { StorageDrivers, getStorageDriver } from '@drivers/storage'
import { DatabaseDrivers, getDatabaseDriver } from '@drivers/database'
import { FetcherDrivers, getFetcherDriver } from '@drivers/fetcher'
import { LoggerDrivers, getLoggerDriver } from '@drivers/logger'
import { AppMapper } from '@adapters/mappers/AppMapper'
import { UIDrivers } from '@entities/services/ui/UIDrivers'

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

export type { App, Page, Table, Automation, Action, Component, Field }

export default class Engine {
  private server: ServerService
  private services: AppServices

  constructor(options: EngineOptions = {}) {
    const folder = options.folder || process.cwd()
    const domain = options.domain || `http://localhost:${options.port}`
    this.server = new ServerService(getServerDriver(options.server, { port: options.port }))
    this.services = {
      templater: new TemplaterService(getTemplaterDriver(options.templater)),
      converter: new ConverterService(getConverterDrivers(options.converter), folder),
      storage: new StorageService(getStorageDriver(options.storage, { folder, domain })),
      database: new DatabaseService(getDatabaseDriver(options.database, { folder })),
      fetcher: new FetcherService(getFetcherDriver(options.fetcher, { domain })),
      logger: new LoggerService(getLoggerDriver(options.logger)),
      ui: new UIService(getUIDriver(options.ui)),
    }
  }

  async start(config: unknown) {
    const appConfig = new AppValidator(this.services).validateConfig(config)
    const app = AppMapper.toApp(appConfig, this.services)
    await this.server.start(app)
  }

  async stop() {
    await this.server.stop()
  }
}
