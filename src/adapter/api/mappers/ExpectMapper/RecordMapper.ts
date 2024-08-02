import type { Logger } from '@domain/services/Logger'
import type { Record as Config } from '@adapter/api/configs/Expect/Record'
import { Record } from '@domain/entities/Expect/Record'
import { FilterMapper } from '@domain/entities/Filter'

interface Services {
  logger: Logger
}

export class RecordMapper {
  static toEntity = (config: Config, services: Services): Record => {
    const { logger } = services
    const find = FilterMapper.toManyEntities(config.find)
    return new Record({ ...config, find, logger })
  }
}
