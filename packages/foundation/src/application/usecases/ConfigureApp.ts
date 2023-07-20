import { App } from '@domain/entities/App'
import { AppRepository } from '@adapter/spi/repositories/AppRepository'
import { mapDtoToApp } from '@application/mappers/AppMapper'

export class ConfigureApp {
  constructor(private appRepository: AppRepository) {}

  execute(): App {
    const appDto = this.appRepository.appDto
    return mapDtoToApp(appDto)
  }
}
