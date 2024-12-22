import type { PostEventConfig } from '@domain/entities/Event/Post'

export interface IPostEvent extends PostEventConfig {
  event: 'Post'
}
