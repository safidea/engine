import { WaitForText } from '@domain/entities/Event/WaitForText'
import type { WaitForText as Config } from '@adapter/api/configs/Event/WaitForText'
import type { Logger } from '@domain/services/Logger'

interface Services {
  logger: Logger
}

export class WaitForTextMapper {
  static toEntity = (config: Config, services: Services): WaitForText => {
    const { logger } = services
    return new WaitForText({ ...config, logger })
  }

  static toManyEntities = (configs: Config[], services: Services): WaitForText[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
