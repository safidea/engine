import { ConfigureApp } from '@application/usecases/ConfigureApp'
import { AppRepository } from '@adapter/spi/repositories/AppRepository'
import { AppDto } from '@application/dtos/AppDto'
import { IOrmRepository } from '@domain/repositories/IOrmRepository'
import { IComponentsRepository } from '@domain/repositories/IComponentsRepository'

interface IAppControllerProps {
  orm: IOrmRepository
  schema: AppDto
  components: IComponentsRepository
}

export class AppController {
  private configureApp: ConfigureApp
  private app: AppDto | undefined
  public orm: IOrmRepository
  public components: IComponentsRepository

  constructor({ orm, schema, components }: IAppControllerProps) {
    const appRepository = new AppRepository(schema)
    this.configureApp = new ConfigureApp(appRepository)
    this.orm = orm
    this.components = components
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
