import { PostEvent } from '@domain/entities/Event/Post'
import type { IPostEvent } from '@adapter/api/configs/Event/Post'

export class PostEventMapper {
  static toEntity = (config: IPostEvent): PostEvent => {
    return new PostEvent(config)
  }

  static toManyEntities = (configs: IPostEvent[]): PostEvent[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
