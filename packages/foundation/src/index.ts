import 'module-alias/register'

import { AppController } from '@adapter/api/app/AppController'
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

export default class Foundation {
  private readonly _path: string
  private readonly _app: App
  private readonly _appController: AppController
  private readonly _server: Server
  private readonly _orm: Orm
  private readonly _ui: UI
  private readonly _fetcher: Fetcher

  constructor(
    config: unknown,
    private folder: string,
    private port: number,
    private serverName = 'express',
    private ormName = 'inmemory',
    private uiName = 'unstyled',
    private fetcherName = 'native',
    private domain = 'localhost:' + port,
    private ssl = false
  ) {
    this._ui = this.selectUI()
    const appMiddleware = new AppMiddleware(config, this._ui)
    this._app = appMiddleware.validateConfig()
    this._path = (this.ssl === true ? 'https://' : 'http://') + this.domain
    this._server = this.selectServer()
    this._orm = this.selectOrm()
    this._fetcher = this.selectFetcher()
    this._appController = new AppController(
      this._app,
      this._server,
      this._orm,
      this._fetcher
    )
  }

  selectServer(): Server {
    switch (this.serverName) {
      case 'express':
        return new ExpressServer(this.port, this.uiName, this.fetcherName, this._path)
      default:
        throw new Error(`Server ${this.serverName} not found`)
    }
  }

  selectOrm(): Orm {
    switch (this.ormName) {
      case 'inmemory':
        return new InMemoryOrm(this.folder)
      default:
        throw new Error(`Orm ${this.ormName} not found`)
    }
  }

  selectUI(): UI {
    switch (this.uiName) {
      case 'unstyled':
        return UnstyledUI
      default:
        throw new Error(`UI ${this.uiName} not found`)
    }
  }

  selectFetcher(): Fetcher {
    switch (this.fetcherName) {
      case 'native':
        return NativeFetcher(this._path)
      default:
        throw new Error(`Fetcher ${this.fetcherName} not found`)
    }
  }

  async start() {
    await this._appController.startServer()
  }

  async stop() {
    await this._appController.stopServer()
  }

  get server(): Server {
    return this._server
  }

  get orm(): Orm {
    return this._orm
  }

  get ui(): UI {
    return this._ui
  }

  get app(): App {
    return this._app
  }
}
