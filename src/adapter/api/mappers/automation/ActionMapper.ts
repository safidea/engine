import type { Action as ActionConfig } from '@adapter/api/configs/automation/action'
import type { Action } from '@domain/entities/automation/action'
import { CreateRecord } from '@domain/entities/automation/action/CreateRecord'
import { SendEmail } from '@domain/entities/automation/action/SendEmail'

export class ActionMapper {
  static toEntity(config: ActionConfig): Action {
    switch (config.action) {
      case 'CreateRecord':
        return new CreateRecord(config)
      case 'SendEmail':
        return new SendEmail(config)
      default:
        throw new Error('Unknown action type')
    }
  }

  static toManyEntities(configs: ActionConfig[]): Action[] {
    return configs.map((config) => this.toEntity(config))
  }
}
