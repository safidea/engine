import { AppDto } from '@adapters/dtos/AppDto'
import { App } from '@entities/app/App'
import { AppServices } from '@entities/app/AppServices'

export class AppMapper {
  static toApp(dto: AppDto, services: AppServices) {
    return new App(dto, services)
  }
}
