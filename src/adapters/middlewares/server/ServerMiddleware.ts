import { ServerController } from '@adapters/controllers/server/ServerController'
import { AppMapper } from '@adapters/mappers/app/AppMapper'
import { IAppDrivers } from '@adapters/mappers/app/IAppDrivers'
import { IAppServerDrivers } from '@adapters/mappers/app/IAppServerDrivers'
import { AppValidator } from '@adapters/validators/app/AppValidator'
import { App } from '@entities/app/App'

export class ServerMiddleware {
  readonly serverController: ServerController
  readonly drivers: IAppServerDrivers

  constructor(
    drivers: IAppDrivers,
    readonly params: { folder: string; domain: string }
  ) {
    const { server, ...appDrivers } = drivers
    this.serverController = new ServerController(server)
    this.drivers = appDrivers
  }

  getAppFromConfig(config: unknown): App {
    const appConfig = AppValidator.validateConfig(config)
    return AppMapper.toServerApp(appConfig, this.drivers)
  }

  async start(config: unknown): Promise<ServerMiddleware> {
    const app = this.getAppFromConfig(config)
    await this.serverController.start(app)
    if (process.env.NODE_ENV === 'production') {
      const name = app.name ? app.name + ' app' : 'App'
      const message = `✨\n✨ ${name} listening on ${this.params.domain}\n✨`
      console.log(message)
    }
    return this
  }

  async stop(): Promise<ServerMiddleware> {
    await this.serverController.stop()
    return this
  }
}
