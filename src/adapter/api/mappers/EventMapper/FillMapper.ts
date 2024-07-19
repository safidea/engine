import { Fill } from '@domain/entities/Event/Fill'
import type { Fill as Config } from '@adapter/api/configs/Event/Fill'
import type { Logger } from '@domain/services/Logger'

interface Services {
  logger: Logger
}

export class FillMapper {
  static toEntity = (config: Config, services: Services): Fill => {
    const { logger } = services
    return new Fill({ ...config, logger })
  }

  static toManyEntities = (configs: Config[], services: Services): Fill[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
