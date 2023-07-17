import { App } from '@domain/entities/App'
import { AppDto } from '@application/dtos/AppDto'
import { mapDtoToApp, mapAppToDto } from '@application/mappers/AppMapper'
import { AppRepository } from '@adapter/spi/repositories/AppRepository'

export class ConfigureApp {
  constructor(private appRepository: AppRepository) {}

  execute(): AppDto {
    const schema: AppDto = this.appRepository.getSchema()
    const appConfig = new App(mapDtoToApp(schema))
    return mapAppToDto(appConfig)
  }
}
