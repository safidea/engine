import { ConfigureApp } from '@application/usecases/ConfigureApp'
import { AppGateway } from '@adapter/spi/gateways/AppGateway'
import { AppDto } from '@application/dtos/AppDto'
import { IOrmGateway } from '@domain/gateways/IOrmGateway'
import { App } from '@domain/entities/App'
import { IServerGateway } from '@domain/gateways/IServerGateway'
import { IUIGateway } from '@domain/gateways/IUIGateway'
import { ICodegenGateway } from '@domain/gateways/ICodegenGateway'
import { TableRoutes } from '../routes/TableRoutes'
import { PageRoutes } from '../routes/PageRoutes'
import { IFetcherGateway } from '@domain/gateways/IFetcherGateway'

export class AppController {
  private readonly _app: App

  constructor(
    config: unknown,
    private readonly _server: IServerGateway,
    private readonly _orm: IOrmGateway,
    private readonly _ui: IUIGateway,
    private readonly _codegen: ICodegenGateway,
    private readonly _fetcher: IFetcherGateway
  ) {
    const configureApp = new ConfigureApp(config, this._ui)
    this._app = configureApp.execute()
    const { pages, tables } = this._app
    if (tables.length > 0) {
      const tableRoutes = new TableRoutes(this._app, this._orm, this._codegen)
      this._server.configureTables(tableRoutes.routes)
    }
    if (pages.length > 0) {
      const pageRoutes = new PageRoutes(this._app, this._ui, this._fetcher)
      this._server.configurePages(pageRoutes.routes)
    }
  }

  get app(): App {
    return this._app
  }

  async startServer() {
    await this._server.start()
  }

  async stopServer() {
    await this._server.stop()
  }

  get orm(): IOrmGateway {
    return this._orm
  }

  get ui(): IUIGateway {
    return this._ui
  }

  get codegen(): ICodegenGateway {
    return this._codegen
  }
}
