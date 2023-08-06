import { AppMapper } from '@adapter/api/app/AppMapper'
import { validate } from '@adapter/api/app/AppUtils'
import { UI } from '@adapter/spi/ui/UI'
import { App } from '@domain/entities/app/App'

export class AppMiddleware {
  constructor(
    private config: unknown,
    private ui: UI
  ) {}

  validateConfig(): App {
    if (validate(this.config)) {
      return AppMapper.toEntity(this.config, this.ui)
    }
    if (validate.errors) throw new Error(JSON.stringify(validate.errors[0], null, 2))
    throw new Error('should throw a validation error')
  }
}
