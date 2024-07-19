import { Post } from '@domain/entities/Event/Post'
import type { Post as Config } from '@adapter/api/configs/Event/Post'
import type { Logger } from '@domain/services/Logger'

interface Services {
  logger: Logger
}

export class PostMapper {
  static toEntity = (config: Config, services: Services): Post => {
    const { logger } = services
    return new Post({ ...config, logger })
  }

  static toManyEntities = (configs: Config[], services: Services): Post[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
