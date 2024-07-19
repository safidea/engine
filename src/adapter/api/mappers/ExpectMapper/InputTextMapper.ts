import type { Logger } from '@domain/services/Logger'
import type { InputText as Config } from '@adapter/api/configs/Expect/InputText'
import { InputText } from '@domain/entities/Expect/InputText'

interface Services {
  logger: Logger
}

export class InputTextMapper {
  static toEntity = (config: Config, services: Services): InputText => {
    const { logger } = services
    return new InputText({ ...config, logger })
  }
}
