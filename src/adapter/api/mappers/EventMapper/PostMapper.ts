import { Post, type Services } from '@domain/entities/Event/Post'
import type { Post as Config } from '@adapter/api/configs/Event/Post'

export class PostMapper {
  static toEntity = (config: Config, services: Services): Post => {
    return new Post(config, services)
  }

  static toManyEntities = (configs: Config[], services: Services): Post[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
