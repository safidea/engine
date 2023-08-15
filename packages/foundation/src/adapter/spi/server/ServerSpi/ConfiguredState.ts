import { StartedState } from './StartedState'
import { ServerStateAdapters, ServerState } from './ServerState'
import { AppMiddleware } from '@adapter/api/app/AppMiddleware'
import { TableRoutes } from '@adapter/api/table/TableRoutes'
import { PageRoutes } from '@adapter/api/page/PageRoutes'
import { App } from '@domain/entities/app/App'
import { OrmSpi } from '@adapter/spi/orm/OrmSpi'
import { FetcherSpi } from '@adapter/spi/fetcher/FetcherSpi'
import { StorageSpi } from '@adapter/spi/storage/StorageSpi'

export class ConfiguredState extends ServerState {
  public app: App

  constructor(config: unknown, adapters: ServerStateAdapters) {
    super(adapters)
    const storageSpi = new StorageSpi(adapters.storage)
    const spis = {
      ui: adapters.ui,
      log: adapters.log,
      storage: storageSpi,
      converter: adapters.converter,
    }
    this.app = new AppMiddleware(config, spis).validateConfig()
  }

  config(config: unknown): ServerState {
    return new ConfiguredState(config, this.adapters)
  }

  async start(): Promise<ServerState> {
    const instance = new StartedState(this)
    const { orm, fetcher, server } = this.adapters
    server.initConfig(this.app)
    if (this.app.tables.length > 0) {
      const ormSpi = new OrmSpi(orm, this.app, instance)
      const tableRoutes = new TableRoutes(this.app, ormSpi)
      server.configureTables(tableRoutes.routes)
    }
    if (this.app.pages.length > 0) {
      const fetcherSpi = new FetcherSpi(fetcher, this.app)
      const pageRoutes = new PageRoutes(this.app, fetcherSpi)
      server.configurePages(pageRoutes.routes)
    }
    await server.start()
    await instance.emit('server_started')
    return instance
  }
}
