import { join } from 'path'
import UnstyledUI from '@drivers/ui/UnstyledUI'
import TailwindUI from '@drivers/ui/TailwindUI'
import { ExpressServer } from '@drivers/server/ExpressServer'
import { JsonOrm } from '@drivers/database/JsonDatabase'
import { NativeFetcher } from '@drivers/fetcher/NativeFetcher'
import { IServerAdapter } from '@entities/services/server_OLD/IServerAdapter'
import { IOrmAdapter } from '@adapters/spi/orm/IOrmAdapter'
import { IFetcherAdapter } from '@adapters/spi/fetcher/IFetcherAdapter'
import { IUISpi } from '@entities/services/ui/IUIService'
import { NativeLogger } from '@drivers/logger/NativeLogger'
import { ILoggerSpi } from '@adapters/services/logger/ILoggerDriver'
import { ServerSpi as Server } from '@entities/services/server_OLD'
import { FileStorage } from '@drivers/storage/FileStorage'
import { Converter } from '@drivers/converter/Converter'
import { IConverterSpi } from '@adapters/services/converter/IConverterDrivers'
import { IStorageSpi } from '@adapters/services/storage/IStorageDriver'
import { HandlebarsTemplating } from '@drivers/templating/HandlebarsTemplating'
import { ITemplatingSpi } from '@entities/services/templater/ITemplaterService'
import { AppDto as App } from '@entities/app/AppSchema'
import { PageDto as Page } from '@entities/app/page/PageSchema'
import { TableDto as Table } from '@adapters/api/table/dtos/TableDto'
import { AutomationDto as Automation } from '@entities/app/automation/AutomationSchema'
import { FieldDto as Field } from '@adapters/api/table/dtos/FieldDto'
import { ComponentDto as Component } from '@adapters/api/page/dtos/ComponentDto'
import { ActionDto as Action } from '@adapters/api/automation/dtos/ActionDto'

export interface EngineOptions {
  server?: IServerAdapter
  orm?: IOrmAdapter
  ui?: IUISpi | string
  fetcher?: IFetcherAdapter
  logger?: ILoggerSpi
  storage?: IStorageSpi
  converter?: IConverterSpi
  templating?: ITemplatingSpi
  folder?: string
  port?: number
  url?: string
  development?: boolean
}

function getUI(ui?: IUISpi | string): IUISpi {
  if (typeof ui === 'string') {
    switch (ui) {
      case 'tailwind':
        return TailwindUI
      default:
        return UnstyledUI
    }
  }
  return ui ?? UnstyledUI
}

export default class Engine {
  private server: Server

  constructor(config: unknown, options: EngineOptions = {}) {
    if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production'
    const port = options.port ?? 3000
    const url = options.url ?? 'http://localhost:' + port
    const folder = options.folder ?? join(process.cwd(), 'app')
    const orm = options.orm ?? new JsonOrm(folder)
    const ui = getUI(options.ui)
    const development = options.development ?? process.env.NODE_ENV !== 'production'
    const fetcher = options.fetcher ?? new NativeFetcher(url)
    const server = options.server ?? new ExpressServer(port, ui.name, development)
    const logger = options.logger ?? NativeLogger
    const storage = options.storage ?? new FileStorage(folder, url)
    const converter = options.converter ?? new Converter(folder)
    const templating = options.templating ?? new HandlebarsTemplating()
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

  async start(): Promise<Server> {
    return this.server.start()
  }

  async stop(): Promise<Server> {
    return this.server.stop()
  }
}

export type { App, Server, Page, Table, Automation, Action, Component, Field }
