import { ConfigureApp } from '@application/usecases/ConfigureApp'
import { AppRepository } from '@adapter/spi/repositories/AppRepository'
import { AppDto } from '@application/dtos/AppDto'
import { IOrmRepository } from '@domain/repositories/IOrmRepository'
import { IComponentsRepository } from '@domain/repositories/IComponentsRepository'
import { ICodegenRepository } from '@domain/repositories/ICodegenRepository'

interface IAppControllerProps {
  orm: IOrmRepository
  schema: AppDto
  components: IComponentsRepository
  codegen: ICodegenRepository
}

export class AppController {
  private app: AppDto
  public orm: IOrmRepository
  public components: IComponentsRepository
  public codegen: ICodegenRepository

  constructor({ orm, schema, components, codegen }: IAppControllerProps) {
    const appRepository = new AppRepository(schema)
    const configureApp = new ConfigureApp(appRepository)
    this.app = configureApp.execute()
    this.orm = orm
    this.components = components
    this.codegen = codegen
  }

  get(): AppDto {
    return this.app
  }
}
