import type { Action as ActionConfig } from '@adapter/api/configs/spec/Action'
import { FilterMapper } from '@adapter/spi/mappers/FilterMapper'
import type { Action } from '@domain/engine/spec/action'
import { Click } from '@domain/engine/spec/action/Click'
import { ClickInEmail } from '@domain/engine/spec/action/ClickInEmail'
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
    if ('mailbox' in config && 'click' in config) {
      const find = config.find.map((filter) => FilterMapper.toEntityFromConfig(filter))
      return new ClickInEmail({ ...config, ...params, find })
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
