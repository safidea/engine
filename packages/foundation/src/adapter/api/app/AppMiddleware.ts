import { AppMapper } from '@adapter/api/app/mappers/AppMapper'
import { validateAppDto } from '@adapter/api/utils/AjvUtils'
import { UI } from '@adapter/spi/ui/UI'
import { App } from '@domain/entities/app/App'

export class AppMiddleware {
  constructor(
    private config: unknown,
    private ui: UI
  ) {}

  validateConfig(): App {
    if (validateAppDto(this.config)) {
      return AppMapper.toEntity(this.config, this.ui)
    }
    if (validateAppDto.errors) throw new Error(JSON.stringify(validateAppDto.errors[0], null, 2))
    throw new Error('should throw a validation error')
  }
}
