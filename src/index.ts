import { join } from 'path'
import UnstyledUI from '@infrastructure/ui/UnstyledUI'
import TailwindUI from '@infrastructure/ui/TailwindUI'
import { ExpressServer } from '@infrastructure/server/ExpressServer'
import { JsonOrm } from '@infrastructure/orm/JsonOrm'
import { NativeFetcher } from '@infrastructure/fetcher/NativeFetcher'
import { IServerAdapter } from '@adapter/spi/server/IServerAdapter'
import { IOrmAdapter } from '@adapter/spi/orm/IOrmAdapter'
import { IFetcherAdapter } from '@adapter/spi/fetcher/IFetcherAdapter'
import { IUISpi } from '@domain/spi/IUISpi'
import { NativeLogger } from '@infrastructure/logger/NativeLogger'
import { ILoggerSpi } from '@domain/spi/ILoggerSpi'
import { ServerSpi as Server } from '@adapter/spi/server/ServerSpi'
import { FileStorage } from '@infrastructure/storage/FileStorage'
import { Converter } from '@infrastructure/converter/Converter'
import { IConverterSpi } from '@domain/spi/IConverterSpi'
import { IStorageSpi } from '@domain/spi/IStorageSpi'
import { HandlebarsTemplating } from '@infrastructure/templating/HandlebarsTemplating'
import { ITemplatingSpi } from '@domain/spi/ITemplatingSpi'
import { AppDto as App } from '@adapter/api/app/AppDto'
import { PageDto as Page } from '@adapter/api/page/dtos/PageDto'
import { TableDto as Table } from '@adapter/api/table/dtos/TableDto'
import { AutomationDto as Automation } from '@adapter/api/automation/dtos/AutomationDto'
import { FieldDto as Field } from '@adapter/api/table/dtos/FieldDto'
import { ComponentDto as Component } from '@adapter/api/page/dtos/ComponentDto'
import { ActionDto as Action } from '@adapter/api/automation/dtos/ActionDto'

export interface EngineOptions {
  adapters?: {
    server?: IServerAdapter
    orm?: IOrmAdapter
    ui?: IUISpi
    fetcher?: IFetcherAdapter
    logger?: ILoggerSpi
    storage?: IStorageSpi
    converter?: IConverterSpi
    templating?: ITemplatingSpi
  }
  folder?: string
  port?: number
  url?: string
  development?: boolean
}

export default class Engine {
  private server: Server

  constructor(options: EngineOptions = {}) {
    const { adapters = {} } = options
    if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production'
    const port = options.port ?? 3000
    const url = options.url ?? 'http://localhost:' + port
    const folder = options.folder ?? join(process.cwd(), 'app')
    const orm = adapters.orm ?? new JsonOrm(folder)
    const ui = adapters.ui ?? UnstyledUI
    const development = options.development ?? process.env.NODE_ENV !== 'production'
    const fetcher = adapters.fetcher ?? new NativeFetcher(url)
    const server = adapters.server ?? new ExpressServer(port, ui.name, development)
    const logger = adapters.logger ?? NativeLogger
    const storage = adapters.storage ?? new FileStorage(folder, url)
    const converter = adapters.converter ?? new Converter(folder)
    const templating = adapters.templating ?? new HandlebarsTemplating()
    this.server = new Server({
      server,
      orm,
      ui,
      fetcher,
      logger,
      storage,
      converter,
      templating,
    })
  }

  config(config: unknown): Server {
    return this.server.config(config)
  }

  async start(): Promise<Server> {
    return this.server.start()
  }

  async stop(): Promise<Server> {
    return this.server.stop()
  }
}

export type { App, Server, Page, Table, Automation, Action, Component, Field }
export { TailwindUI }
