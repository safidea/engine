import type { Trigger as TriggerConfig } from '@adapter/api/configs/automation/trigger'
import type { Trigger } from '@domain/entities/automation/trigger'
import { RecordCreated } from '@domain/entities/automation/trigger/RecordCreated'
import { WebhookCalled } from '@domain/entities/automation/trigger/WebhookCalled'

export class TriggerMapper {
  static toEntity(config: TriggerConfig): Trigger {
    switch (config.event) {
      case 'RecordCreated':
        return new RecordCreated(config)
      case 'WebhookCalled':
        return new WebhookCalled(config)
      default:
        throw new Error('Unknown trigger event')
    }
  }

  static toManyEntities(configs: TriggerConfig[]): Trigger[] {
    return configs.map((config) => this.toEntity(config))
  }
}
