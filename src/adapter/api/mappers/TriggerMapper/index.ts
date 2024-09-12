import type { Trigger as Config } from '@adapter/api/configs/Trigger'
import type { Trigger } from '@domain/entities/Trigger'
import type { Queue } from '@domain/services/Queue'
import type { Realtime } from '@domain/services/Realtime'
import type { Server } from '@domain/services/Server'
import { RecordCreatedMapper } from './RecordCreatedMapper'
import { WebhookCalledMapper } from './WebhookCalledMapper'
import { ApiCalledMapper } from './ApiCalledMapper'
import type { SchemaValidator } from '@domain/services/SchemaValidator'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Monitor } from '@domain/services/Monitor'

type MapperConfig = Config & {
  automation: string
}

interface Services {
  server: Server
  queue: Queue
  realtime: Realtime
  schemaValidator: SchemaValidator
  templateCompiler: TemplateCompiler
  monitor: Monitor
}

export class TriggerMapper {
  static toEntity(config: MapperConfig, services: Services): Trigger {
    const { event } = config
    if (event === 'RecordCreated') return RecordCreatedMapper.toEntity(config, services)
    if (event === 'WebhookCalled') return WebhookCalledMapper.toEntity(config, services)
    if (event === 'ApiCalled') return ApiCalledMapper.toEntity(config, services)
    throw new Error(`TriggerMapper: trigger ${event} not found`)
  }

  static toManyEntities(configs: MapperConfig[], services: Services): Trigger[] {
    return configs.map((config) => this.toEntity(config, services))
  }
}
