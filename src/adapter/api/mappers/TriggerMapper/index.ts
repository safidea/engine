import type { Trigger as Config } from '@adapter/api/configs/Trigger'
import type { Trigger } from '@domain/entities/Trigger'
import type { Queue } from '@domain/services/Queue'
import type { Realtime } from '@domain/services/Realtime'
import type { Server } from '@domain/services/Server'
import { RecordCreatedMapper } from './RecordCreated'
import { WebhookCalledMapper } from './WebhookCalled'

type MapperConfig = Config & {
  automation: string
}

interface Services {
  server: Server
  queue: Queue
  realtime: Realtime
}

export class TriggerMapper {
  static toEntity(config: MapperConfig, services: Services): Trigger {
    const { trigger } = config
    if (trigger === 'RecordCreated') return RecordCreatedMapper.toEntity(config, services)
    if (trigger === 'WebhookCalled') return WebhookCalledMapper.toEntity(config, services)
    throw new Error(`TriggerMapper: trigger ${trigger} not found`)
  }

  static toManyEntities(configs: MapperConfig[], services: Services): Trigger[] {
    return configs.map((config) => this.toEntity(config, services))
  }
}
