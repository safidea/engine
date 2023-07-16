import { App } from '@domain/entities/App'
import { AppDto } from '@application/dtos/AppDto'
import { mapDtoToApp } from '@application/mappers/AppMapper'
import { AppRepository } from '@adapter/spi/repositories/AppRepository'

export class ConfigureApp {
  constructor(private appRepository: AppRepository) {}

  async execute(): Promise<AppDto> {
    const schema: AppDto = await this.appRepository.getSchema()
    return new App(mapDtoToApp(schema))
  }
}
