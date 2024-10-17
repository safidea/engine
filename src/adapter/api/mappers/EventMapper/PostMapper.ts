import { Post } from '@domain/entities/Event/Post'
import type { Post as Config } from '@adapter/api/configs/Event/Post'

export class PostMapper {
  static toEntity = (config: Config): Post => {
    return new Post(config)
  }

  static toManyEntities = (configs: Config[]): Post[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
