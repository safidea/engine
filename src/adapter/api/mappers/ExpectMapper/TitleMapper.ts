import type { Logger } from '@domain/services/Logger'
import type { Title as Config } from '@adapter/api/configs/Expect/Title'
import { Title } from '@domain/entities/Expect/Title'

interface Services {
  logger: Logger
}

export class TitleMapper {
  static toEntity = (config: Config, services: Services): Title => {
    const { logger } = services
    return new Title({ ...config, logger })
  }
}
