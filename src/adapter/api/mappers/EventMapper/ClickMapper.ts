import { Click } from '@domain/entities/Event/Click'
import type { Click as Config } from '@adapter/api/configs/Event/Click'
import type { Logger } from '@domain/services/Logger'

interface Services {
  logger: Logger
}

export class ClickMapper {
  static toEntity = (config: Config, services: Services): Click => {
    const { logger } = services
    return new Click({ ...config, logger })
  }

  static toManyEntities = (configs: Config[], services: Services): Click[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
