import type { Trigger as TriggerConfig } from '@adapter/api/configs/automation/trigger'
import type { Trigger } from '@domain/entities/automation/trigger'
import { RecordCreated } from '@domain/entities/automation/trigger/RecordCreated'
import { WebhookCalled } from '@domain/entities/automation/trigger/WebhookCalled'
import type { Server } from '@domain/services/Server'

interface Params {
  server: Server
}

export class TriggerMapper {
  static toEntity(config: TriggerConfig, params: Params): Trigger {
    const { server } = params
    switch (config.event) {
      case 'RecordCreated':
        return new RecordCreated(config)
      case 'WebhookCalled':
        return new WebhookCalled({ ...config, server })
      default:
        throw new Error('Unknown trigger event')
    }
  }

  static toManyEntities(configs: TriggerConfig[], params: Params): Trigger[] {
    return configs.map((config) => this.toEntity(config, params))
  }
}
