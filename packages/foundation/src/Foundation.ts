import 'module-alias/register'
import { join } from 'path'
import { UnstyledUI } from '@infrastructure/ui/UnstyledUI'
import { ExpressServer } from '@infrastructure/server/ExpressServer/server'
import { InMemoryOrm } from '@infrastructure/orm/InMemoryOrm'
import { NativeFetcher } from '@infrastructure/fetcher/NativeFetcher'
import { IServerAdapter } from '@adapter/spi/server/IServerAdapter'
import { IOrmAdapter } from '@adapter/spi/orm/IOrmAdapter'
import { IFetcherAdapter } from '@adapter/spi/fetcher/IFetcherAdapter'
import { IUIAdapter } from '@adapter/spi/ui/IUIAdapter'
import { NativeLog } from '@infrastructure/log/NativeLog'
import { ILogAdapter } from '@adapter/spi/log/ILogAdapter'
import { ServerSpi } from '@adapter/spi/server/ServerSpi'

export interface FoundationOptions {
  adapters?: {
    server?: IServerAdapter
    orm?: IOrmAdapter
    ui?: IUIAdapter
    fetcher?: IFetcherAdapter
    log?: ILogAdapter
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
    const orm = adapters.orm ?? new InMemoryOrm(folder)
    const ui = adapters.ui ?? UnstyledUI
    const fetcher = adapters.fetcher ?? new NativeFetcher(url)
    const server = adapters.server ?? new ExpressServer(port)
    const log = adapters.log ?? NativeLog
    this.serverSpi = new ServerSpi({ server, orm, ui, fetcher, log })
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
