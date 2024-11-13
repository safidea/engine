import type { Trigger as Config } from '@adapter/api/configs/Trigger'
import type { Trigger } from '@domain/entities/Trigger'
import type { Queue } from '@domain/services/Queue'
import type { Realtime } from '@domain/services/Realtime'
import type { Server } from '@domain/services/Server'
import { RecordCreatedMapper } from './database/RecordCreatedMapper'
import { WebhookCalledMapper } from './http/WebhookCalledMapper'
import { ApiCalledMapper } from './http/ApiCalledMapper'
import type { SchemaValidator } from '@domain/services/SchemaValidator'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Monitor } from '@domain/services/Monitor'
import { PageCreatedMapper } from './notion/PageCreatedMapper'
import type { Notion } from '@domain/integrations/Notion'

type MapperConfig = Config & {
  automation: string
}

export interface Services {
  server: Server
  queue: Queue
  realtime: Realtime
  schemaValidator: SchemaValidator
  templateCompiler: TemplateCompiler
  monitor: Monitor
}

export interface Integrations {
  notion: Notion
}

export class TriggerMapper {
  static toEntity(config: MapperConfig, services: Services, integrations: Integrations): Trigger {
    const { event } = config
    if (event === 'RecordCreated') return RecordCreatedMapper.toEntity(config, services)
    if (event === 'WebhookCalled') return WebhookCalledMapper.toEntity(config, services)
    if (event === 'ApiCalled') return ApiCalledMapper.toEntity(config, services)
    if (event === 'PageCreated') return PageCreatedMapper.toEntity(config, services, integrations)
    throw new Error(`TriggerMapper: trigger ${event} not found`)
  }

  static toManyEntities(
    configs: MapperConfig[],
    services: Services,
    integrations: Integrations
  ): Trigger[] {
    return configs.map((config) => this.toEntity(config, services, integrations))
  }
}
