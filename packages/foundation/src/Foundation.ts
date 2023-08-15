import 'module-alias/register'
import { join } from 'path'
import { UnstyledUI } from '@infrastructure/ui/UnstyledUI'
import { ExpressServer } from '@infrastructure/server/ExpressServer/server'
import { JsonOrm } from '@infrastructure/orm/JsonOrm'
import { NativeFetcher } from '@infrastructure/fetcher/NativeFetcher'
import { IServerAdapter } from '@adapter/spi/server/IServerAdapter'
import { IOrmAdapter } from '@adapter/spi/orm/IOrmAdapter'
import { IFetcherAdapter } from '@adapter/spi/fetcher/IFetcherAdapter'
import { IUIAdapter } from '@adapter/spi/ui/IUIAdapter'
import { NativeLog } from '@infrastructure/log/NativeLog'
import { ILogAdapter } from '@adapter/spi/log/ILogAdapter'
import { ServerSpi } from '@adapter/spi/server/ServerSpi'
import { IStorageAdapter } from '@adapter/spi/storage/IStorageAdapter'
import { FileStorage } from '@infrastructure/storage/FileStorage'

export interface FoundationOptions {
  adapters?: {
    server?: IServerAdapter
    orm?: IOrmAdapter
    ui?: IUIAdapter
    fetcher?: IFetcherAdapter
    log?: ILogAdapter
    storage?: IStorageAdapter
    converter?: any
  }
  folder?: string
  port?: number
  url?: string
}

export default class Foundation {
  private serverSpi: ServerSpi

  constructor(options: FoundationOptions = {}) {
    const { adapters = {} } = options
    const port = options.port ?? 3000
    const url = options.url ?? 'http://localhost:' + port
    const folder = options.folder ?? join(process.cwd(), 'app')
    const orm = adapters.orm ?? new JsonOrm(folder)
    const ui = adapters.ui ?? UnstyledUI
    const fetcher = adapters.fetcher ?? new NativeFetcher(url)
    const server = adapters.server ?? new ExpressServer(port)
    const log = adapters.log ?? NativeLog
    const storage = adapters.storage ?? new FileStorage(folder)
    const converter = adapters.converter ?? {}
    this.serverSpi = new ServerSpi({ server, orm, ui, fetcher, log, storage, converter })
  }

  config(config: unknown): ServerSpi {
    return this.serverSpi.config(config)
  }

  async start(): Promise<ServerSpi> {
    return this.serverSpi.start()
  }

  async stop(): Promise<ServerSpi> {
    return this.serverSpi.stop()
  }
}
