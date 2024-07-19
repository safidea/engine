import type { Logger } from '@domain/services/Logger'
import type { Url as Config } from '@adapter/api/configs/Expect/Url'
import { Url } from '@domain/entities/Expect/Url'

interface Services {
  logger: Logger
}

export class UrlMapper {
  static toEntity = (config: Config, services: Services): Url => {
    const { logger } = services
    return new Url({ ...config, logger })
  }
}
