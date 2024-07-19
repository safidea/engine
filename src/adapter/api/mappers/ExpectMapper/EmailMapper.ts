import type { Logger } from '@domain/services/Logger'
import type { Email as Config } from '@adapter/api/configs/Expect/Email'
import { Email } from '@domain/entities/Expect/Email'
import { FilterMapper } from '../FilterMapper'

interface Services {
  logger: Logger
}

export class EmailMapper {
  static toEntity = (config: Config, services: Services): Email => {
    const { logger } = services
    const find = FilterMapper.toManyEntities(config.find)
    return new Email({ ...config, find, logger })
  }
}
