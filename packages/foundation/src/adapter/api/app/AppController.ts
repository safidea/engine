import { Orm } from '@adapter/spi/orm/Orm'
import { App } from '@domain/entities/app/App'
import { Server } from '@adapter/spi/server/Server'
import { TableRoutes } from '../table/TableRoutes'
import { PageRoutes } from '../page/PageRoutes'
import { Fetcher } from '@adapter/spi/fetcher/Fetcher'

export class AppController {
  constructor(
    app: App,
    private server: Server,
    orm: Orm,
    fetcher: Fetcher
  ) {
    const { pages, tables } = app
    if (tables.length > 0) {
      const tableRoutes = new TableRoutes(app, orm)
      this.server.configureTables(tableRoutes.routes)
    }
    if (pages.length > 0) {
      const pageRoutes = new PageRoutes(app, fetcher)
      this.server.configurePages(pageRoutes.routes, app)
    }
  }

  async startServer() {
    await this.server.start()
  }

  async stopServer() {
    await this.server.stop()
  }
}
