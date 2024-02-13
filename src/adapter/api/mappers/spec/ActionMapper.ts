import type { Action as ActionConfig } from '@adapter/api/configs/spec/action'
import type { Action } from '@domain/engine/spec/action'
import { Click } from '@domain/engine/spec/action/Click'
import { Fill } from '@domain/engine/spec/action/Fill'
import { Open } from '@domain/engine/spec/action/Open'
import { Post } from '@domain/engine/spec/action/Post'
import { WaitForAutomation } from '@domain/engine/spec/action/WaitForAutomation'
import { WaitForText } from '@domain/engine/spec/action/WaitForText'
import type { BaseParams as ActionParams } from '@domain/engine/spec/action/base'

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
    if ('click' in config) {
      return new Click({ ...config, ...params })
    }
    if ('waitForText' in config) {
      return new WaitForText({ ...config, ...params })
    }
    if ('waitForAutomation' in config) {
      return new WaitForAutomation({ ...config, ...params })
    }
    throw new Error('Unknown action')
  }

  static toManyEntities(configs: ActionConfig[], params: ActionParams): Action[] {
    return configs.map((config) => this.toEntity(config, params))
  }
}
