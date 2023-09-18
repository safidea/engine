import { AppDto } from '@adapters/dtos/AppDto'
import { App, AppServices } from '@entities/app/App'

export class AppMapper {
  static toApp(dto: AppDto, services: AppServices) {
    return new App(dto, services)
  }
}
