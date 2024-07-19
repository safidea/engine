import type { Logger } from '@domain/services/Logger'
import type { Attribute as Config } from '@adapter/api/configs/Expect/Attribute'
import { Attribute } from '@domain/entities/Expect/Attribute'

interface Services {
  logger: Logger
}

export class AttributeMapper {
  static toEntity = (config: Config, services: Services): Attribute => {
    const { logger } = services
    return new Attribute({ ...config, logger })
  }
}
