import type { Config } from '@domain/entities/Event/Post'

export interface Post extends Config {
  event: 'Post'
}
