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
import { getUIDriver } from '@drivers/ui'
import { TemplaterDrivers, getTemplaterDriver } from '@drivers/templater'
import { ConverterDrivers, getConverterDrivers } from '@drivers/converter'
import { StorageDrivers, getStorageDriver } from '@drivers/storage'
import { DatabaseDrivers, getDatabaseDriver } from '@drivers/database'
import { FetcherDrivers, getFetcherDriver } from '@drivers/fetcher'
import { LoggerDrivers, getLoggerDriver } from '@drivers/logger'
import { UIDrivers } from '@entities/services/ui/UIDrivers'
import { ServerMiddleware } from '@adapters/middlewares/server/ServerMiddleware'
import { IAppDrivers } from '@adapters/mappers/app/IAppDrivers'
import { IconDrivers } from '@entities/services/icon/IconDrivers'
import { getIconDriver } from '@drivers/icon'
import { App } from '@entities/app/App'
import { AppValidator } from '@adapters/validators/app/AppValidator'

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
  icon?: IconDrivers
  folder?: string
  port?: number
  domain?: string
}

export class Engine {
  private serverMiddleware: ServerMiddleware
  readonly drivers: IAppDrivers
  readonly folder: string
  readonly domain: string
  readonly port: number
  readonly app: App

  constructor(config: unknown, options: EngineOptions = {}) {
    this.folder = options.folder || process.cwd()
    this.port = options.port || 3000
    this.domain = options.domain || `http://localhost:${this.port}`
    const tmpFolder = `${this.folder}/tmp`
    fs.ensureDirSync(this.folder)
    fs.ensureDirSync(tmpFolder)
    const icon = getIconDriver(options.icon)
    this.drivers = {
      server: getServerDriver(options.server, { port: this.port, folder: this.folder }),
      templater: getTemplaterDriver(options.templater),
      converter: getConverterDrivers(options.converter, { tmpFolder }),
      storage: getStorageDriver(options.storage, { folder: this.folder, domain: this.domain }),
      database: getDatabaseDriver(options.database, { folder: this.folder }),
      fetcher: getFetcherDriver(options.fetcher, { domain: this.domain }),
      logger: getLoggerDriver(options.logger),
      ui: getUIDriver(options.ui, icon),
      icon,
    }
    this.serverMiddleware = new ServerMiddleware(this.drivers, {
      folder: this.folder,
      domain: this.domain,
    })
    this.app = this.serverMiddleware.getAppFromConfig(config)
  }

  async start(): Promise<Engine> {
    await this.serverMiddleware.start(this.app)
    return this
  }

  async stop(): Promise<Engine> {
    await this.serverMiddleware.stop()
    return this
  }

  static validateConfig(config: unknown): Config {
    return AppValidator.validateConfig(config)
  }
}
