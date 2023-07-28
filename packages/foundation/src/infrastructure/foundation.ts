import 'module-alias/register'

import { AppController } from '@adapter/api/controllers/AppController'
import { UnstyledUI } from '@infrastructure/ui/UnstyledUI'
import { ExpressServer } from './server/ExpressServer'
import { InMemoryOrm } from './orm/InMemoryOrm'
import { NativeFetcher } from './fetcher/NativeFetcher'
import { IServerGateway } from '@domain/gateways/IServerGateway'
import { IOrmGateway } from '@domain/gateways/IOrmGateway'
import { IUIGateway } from '@domain/gateways/IUIGateway'
import { App } from '@domain/entities/App'
import { IFetcherGateway } from '@domain/gateways/IFetcherGateway'

export class Foundation {
  private readonly _app: AppController
  private readonly _server: IServerGateway
  private readonly _orm: IOrmGateway
  private readonly _ui: IUIGateway
  private readonly _fetcher: IFetcherGateway

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
    this._server = this.selectServer()
    this._orm = this.selectOrm()
    this._ui = this.selectUI()
    this._fetcher = this.selectFetcher()
    this._app = new AppController(config, this._server, this._orm, this._ui, this._fetcher)
  }

  selectServer(): IServerGateway {
    switch (this.serverName) {
      case 'express':
        return new ExpressServer(this.port, this.uiName, this.fetcherName, this.domain)
      default:
        throw new Error(`Server ${this.serverName} not found`)
    }
  }

  selectOrm(): IOrmGateway {
    switch (this.ormName) {
      case 'inmemory':
        return new InMemoryOrm(this.folder)
      default:
        throw new Error(`Orm ${this.ormName} not found`)
    }
  }

  selectUI(): IUIGateway {
    switch (this.uiName) {
      case 'unstyled':
        return UnstyledUI
      default:
        throw new Error(`UI ${this.uiName} not found`)
    }
  }

  selectFetcher(): IFetcherGateway {
    const path = (this.ssl === true ? 'https://' : 'http://') + this.domain
    switch (this.fetcherName) {
      case 'native':
        return NativeFetcher(path)
      default:
        throw new Error(`Fetcher ${this.fetcherName} not found`)
    }
  }

  async start() {
    await this._app.startServer()
  }

  async stop() {
    await this._app.stopServer()
  }

  get server(): IServerGateway {
    return this._server
  }

  get orm(): IOrmGateway {
    return this._orm
  }

  get ui(): IUIGateway {
    return this._ui
  }

  get app(): App {
    return this._app.app
  }
}
