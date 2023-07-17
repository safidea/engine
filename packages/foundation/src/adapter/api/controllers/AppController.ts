import { ConfigureApp } from '@application/usecases/ConfigureApp'
import { AppRepository } from '@adapter/spi/repositories/AppRepository'
import { AppDto } from '@application/dtos/AppDto'

export class AppController {
  private configureApp: ConfigureApp
  private app: AppDto | undefined

  constructor() {
    const appRepository = new AppRepository()
    this.configureApp = new ConfigureApp(appRepository)
  }

  async configure(): Promise<AppDto> {
    this.app = await this.configureApp.execute()
    return this.app
  }

  async getConfig(): Promise<AppDto> {
    if (!this.app) this.app = await this.configure()
    return this.app
  }
}
