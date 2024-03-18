import type { Trigger as TriggerConfig } from '@adapter/api/configs/automation/trigger'
import type { Trigger } from '@domain/engine/automation/trigger'
import { RecordCreated } from '@domain/engine/automation/trigger/RecordCreated'
import { WebhookCalled } from '@domain/engine/automation/trigger/WebhookCalled'
import type { Queue } from '@domain/services/Queue'
import type { Realtime } from '@domain/services/Realtime'
import type { Server } from '@domain/services/Server'

interface Params {
  automation: string
  server: Server
  queue: Queue
  realtime: Realtime
}

export class TriggerMapper {
  static toEntity(config: TriggerConfig, params: Params): Trigger {
    switch (config.event) {
      case 'RecordCreated':
        return new RecordCreated({ ...config, ...params })
      case 'WebhookCalled':
        return new WebhookCalled({ ...config, ...params })
      default:
        throw new Error('Unknown trigger event')
    }
  }

  static toManyEntities(configs: TriggerConfig[], params: Params): Trigger[] {
    return configs.map((config) => this.toEntity(config, params))
  }
}
