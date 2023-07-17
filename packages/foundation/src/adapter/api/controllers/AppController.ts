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
  private app: AppDto
  public orm: IOrmRepository
  public components: IComponentsRepository

  constructor({ orm, schema, components }: IAppControllerProps) {
    const appRepository = new AppRepository(schema)
    const configureApp = new ConfigureApp(appRepository)
    this.app = configureApp.execute()
    this.orm = orm
    this.components = components
  }

  get(): AppDto {
    return this.app
  }
}
