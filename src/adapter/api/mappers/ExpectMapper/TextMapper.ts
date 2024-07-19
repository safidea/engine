import type { Logger } from '@domain/services/Logger'
import type { Text as Config } from '@adapter/api/configs/Expect/Text'
import { Text } from '@domain/entities/Expect/Text'

interface Services {
  logger: Logger
}

export class TextMapper {
  static toEntity = (config: Config, services: Services): Text => {
    const { logger } = services
    return new Text({ ...config, logger })
  }
}
