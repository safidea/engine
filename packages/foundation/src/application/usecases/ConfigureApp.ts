import { App } from '@domain/entities/App'
import { AppRepository } from '@adapter/spi/repositories/AppRepository'
import { mapDtoToApp } from '@application/mappers/AppMapper'
import { IUIRepository } from '@domain/repositories/IUIRepository'

export class ConfigureApp {
  constructor(
    private appRepository: AppRepository,
    private ui: IUIRepository
  ) {}

  execute(): App {
    const appDto = this.appRepository.appDto
    return mapDtoToApp(appDto, this.ui)
  }
}
