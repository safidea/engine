import { ConfigureApp } from '@application/usecases/ConfigureApp'
import { AppRepository } from '@adapter/spi/repositories/AppRepository'
import { AppDto } from '@application/dtos/AppDto'
import { IOrmRepository } from '@domain/repositories/IOrmRepository'
import { App } from '@domain/entities/App'
import { IServerRepository } from '@domain/repositories/IServerRepository'
import { IUIRepository } from '@domain/repositories/IUIRepository'
import { ICodegenRepository } from '@domain/repositories/ICodegenRepository'
import { TableRoutes } from '../routes/TableRoutes'
import { PageRoutes } from '../routes/PageRoutes'

export class AppController {
  private readonly _app: App

  constructor(
    appDto: AppDto,
    private readonly _server: IServerRepository,
    private readonly _orm: IOrmRepository,
    private readonly _ui: IUIRepository,
    private readonly _codegen: ICodegenRepository
  ) {
    const appRepository = new AppRepository(appDto)
    const configureApp = new ConfigureApp(appRepository, this._ui)
    this._app = configureApp.execute()
    const { pages, tables } = this._app
    if (tables.length > 0) {
      const tableRoutes = new TableRoutes(this._app, this._orm, this._codegen)
      this._server.configureTables(tableRoutes.routes)
    }
    if (pages.length > 0) {
      const pageRoutes = new PageRoutes(this._app)
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

  get orm(): IOrmRepository {
    return this._orm
  }

  get ui(): IUIRepository {
    return this._ui
  }

  get codegen(): ICodegenRepository {
    return this._codegen
  }
}
