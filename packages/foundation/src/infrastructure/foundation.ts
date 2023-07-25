import 'module-alias/register'
import dotenv from 'dotenv'
dotenv.config()

import { AppController } from '@adapter/api/controllers/AppController'
import { UnstyledUI } from '@infrastructure/ui/UnstyledUI'
import { codegen } from '@infrastructure/codegen'
import { AppDto } from '@application/dtos/AppDto'
import { ExpressServer } from './server/ExpressServer'
import { InMemoryOrm } from './orm/InMemoryOrm'
import { IServerRepository } from '@domain/repositories/IServerRepository'
import { IOrmRepository } from '@domain/repositories/IOrmRepository'
import { IUIRepository } from '@domain/repositories/IUIRepository'
import { App } from '@domain/entities/App'

export class Foundation {
  private readonly _app: AppController
  private readonly _server: IServerRepository
  private readonly _orm: IOrmRepository
  private readonly _ui: IUIRepository

  constructor(
    appDto: AppDto,
    folder: string,
    port: number,
    serverName?: string,
    ormName?: string,
    uiName?: string
  ) {
    this._server = this.selectServer(serverName, port)
    this._orm = this.selectOrm(ormName, folder)
    this._ui = this.selectUI(uiName)
    this._app = new AppController(appDto, this._server, this._orm, this._ui, codegen)
  }

  selectServer(serverName = 'express', port: number): IServerRepository {
    switch (serverName) {
      case 'express':
        return new ExpressServer(port)
      default:
        throw new Error(`Server ${serverName} not found`)
    }
  }

  selectOrm(ormName = 'inmemory', folder: string): IOrmRepository {
    switch (ormName) {
      case 'inmemory':
        return new InMemoryOrm(folder)
      default:
        throw new Error(`Orm ${ormName} not found`)
    }
  }

  selectUI(uiName = 'unstyled'): IUIRepository {
    switch (uiName) {
      case 'unstyled':
        return UnstyledUI
      default:
        throw new Error(`UI ${uiName} not found`)
    }
  }

  async start() {
    await this._app.startServer()
  }

  async stop() {
    await this._app.stopServer()
  }

  get server(): IServerRepository {
    return this._server
  }

  get orm(): IOrmRepository {
    return this._orm
  }

  get app(): App {
    return this._app.app
  }

  get ui() {
    return this._ui
  }

  get codegen() {
    return codegen
  }
}
