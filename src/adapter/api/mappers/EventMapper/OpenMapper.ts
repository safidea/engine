import { Open } from '@domain/entities/Event/Open'
import type { Open as Config } from '@adapter/api/configs/Event/Open'
import type { Logger } from '@domain/services/Logger'

interface Services {
  logger: Logger
}

export class OpenMapper {
  static toEntity = (config: Config, services: Services): Open => {
    const { logger } = services
    return new Open({ ...config, logger })
  }

  static toManyEntities = (configs: Config[], services: Services): Open[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
