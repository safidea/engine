import type { Action as ActionConfig } from '@adapter/api/configs/spec/Action'
import type { Action } from '@domain/entities/spec/Action'
import { Fill } from '@domain/entities/spec/Action/Fill'
import { Open } from '@domain/entities/spec/Action/Open'
import { Post } from '@domain/entities/spec/Action/Post'
import type { BaseParams as ActionParams } from '@domain/entities/spec/Action/base'

export class ActionMapper {
  static toEntity(config: ActionConfig, params: ActionParams): Action {
    if ('open' in config) {
      return new Open({ ...config, ...params })
    }
    if ('fill' in config) {
      return new Fill({ ...config, ...params })
    }
    if ('post' in config) {
      return new Post({ ...config, ...params })
    }
    throw new Error('Unknown action')
  }

  static toManyEntities(configs: ActionConfig[], params: ActionParams): Action[] {
    return configs.map((config) => this.toEntity(config, params))
  }
}
