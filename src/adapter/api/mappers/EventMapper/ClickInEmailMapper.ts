import { ClickInEmail } from '@domain/entities/Event/ClickInEmail'
import type { ClickInEmail as Config } from '@adapter/api/configs/Event/ClickInEmail'
import type { Logger } from '@domain/services/Logger'
import { FilterMapper } from '@domain/entities/Filter'

interface Services {
  logger: Logger
}

export class ClickInEmailMapper {
  static toEntity = (config: Config, services: Services): ClickInEmail => {
    const { logger } = services
    const find = FilterMapper.toManyEntities(config.find)
    return new ClickInEmail({ ...config, find, logger })
  }

  static toManyEntities = (configs: Config[], services: Services): ClickInEmail[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
