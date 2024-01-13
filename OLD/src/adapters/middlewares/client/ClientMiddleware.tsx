import { ClientController } from '@adapters/controllers/client/ClientController'
import { ConfigDto } from '@adapters/dtos/ConfigDto'
import { AppMapper } from '@adapters/mappers/app/AppMapper'
import { IAppClientDrivers } from '@adapters/mappers/app/IAppClientDrivers'
import { App } from '@entities/app/App'

export class ClientMiddleware {
  readonly clientController: ClientController

  constructor(
    readonly drivers: IAppClientDrivers,
    params: { [key: string]: string }
  ) {
    this.clientController = new ClientController(params)
  }

  getAppFromConfig(config: ConfigDto): App {
    return AppMapper.toClientApp(config, this.drivers)
  }

  async hydrate(config: ConfigDto, path: string): Promise<void> {
    const app = this.getAppFromConfig(config)
    const page = app.pages.getByPath(path)
    if (!page) throw new Error('Page not found: ' + path)
    const container = document.getElementById('root')
    if (!container) throw new Error('Root element not found')
    await this.clientController.hydrate(page, container)
  }
}
