import 'module-alias/register'
import { join } from 'path'
import { UnstyledUI } from '@infrastructure/ui/UnstyledUI'
import { ExpressServer } from '@infrastructure/server/ExpressServer'
import { InMemoryOrm } from '@infrastructure/orm/InMemoryOrm'
import { NativeFetcher } from '@infrastructure/fetcher/NativeFetcher'
import { Server } from '@adapter/spi/server/Server'
import { Orm } from '@adapter/spi/orm/Orm'
import { UI } from '@adapter/spi/ui/UI'
import { App } from '@domain/entities/app/App'
import { Fetcher } from '@adapter/spi/fetcher/Fetcher'
import { AppMiddleware } from '@adapter/api/app/AppMiddleware'
import { TableRoutes } from '@adapter/api/table/TableRoutes'
import { PageRoutes } from '@adapter/api/page/PageRoutes'

interface FoundationOptions {
  server?: 'express'
  orm?: 'inmemory'
  ui?: 'unstyled'
  fetcher?: 'native'
  folder?: string
  port?: number
  url?: string
  log?: (message: string) => void
}

interface FoundationParams {
  server: 'express'
  orm: 'inmemory'
  ui: 'unstyled'
  fetcher: 'native'
  folder: string
  port?: number
  url?: string
}

export default class Foundation {
  private params: FoundationParams
  private server: Server
  private orm: Orm
  private ui: UI
  private fetcher: Fetcher
  private log?: (message: string) => void

  constructor(options?: FoundationOptions) {
    const {
      server = 'express',
      orm = 'inmemory',
      ui = 'unstyled',
      fetcher = 'native',
      folder = join(process.cwd(), 'app'),
      port,
      url,
      log,
    } = options || {}
    this.params = { folder, server, orm, ui, fetcher, port, url }
    this.orm = this.getOrm()
    this.ui = this.getUI()
    this.fetcher = this.getFetcher()
    this.server = this.getServer()
    this.log = log
  }

  async config(config: unknown): Promise<App> {
    const app = new AppMiddleware(config, this.ui, this.log).validateConfig()
    const { pages, tables } = app
    if (tables.length > 0) {
      const tableRoutes = new TableRoutes(app, this.orm)
      this.server.configureTables(tableRoutes.routes)
    }
    if (pages.length > 0) {
      const pageRoutes = new PageRoutes(app, this.fetcher)
      this.server.configurePages(pageRoutes.routes, app)
    }
    return app
  }

  async start() {
    const { port, url } = await this.server.start()
    this.params.port = port
    this.params.url = url
    return { port, url }
  }

  async stop() {
    return this.server.start()
  }

  getServer(): Server {
    const { server, ui, url, port } = this.params
    switch (server) {
      case 'express':
        return new ExpressServer(ui, this.fetcher, url, port)
      default:
        throw new Error(`Server ${server} not found`)
    }
  }

  getOrm(): Orm {
    const { orm, folder } = this.params
    switch (orm) {
      case 'inmemory':
        return new InMemoryOrm(folder)
      default:
        throw new Error(`Orm ${orm} not found`)
    }
  }

  getUI(): UI {
    const { ui } = this.params
    switch (ui) {
      case 'unstyled':
        return UnstyledUI
      default:
        throw new Error(`UI ${ui} not found`)
    }
  }

  getFetcher(): Fetcher {
    const { fetcher, url } = this.params
    switch (fetcher) {
      case 'native':
        return new NativeFetcher(url)
      default:
        throw new Error(`Fetcher ${fetcher} not found`)
    }
  }
}
