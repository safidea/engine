import type { ITrigger } from '@adapter/api/configs/Trigger'
import type { Trigger } from '@domain/entities/Trigger'
import type { Queue } from '@domain/services/Queue'
import type { Realtime } from '@domain/services/Realtime'
import type { Server } from '@domain/services/Server'
import type { SchemaValidator } from '@domain/services/SchemaValidator'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Monitor } from '@domain/services/Monitor'
import type { Notion } from '@domain/integrations/Notion'
import { RecordCreatedDatabaseTriggerMapper } from './database/RecordCreatedMapper'
import { ApiCalledHttpTriggerMapper } from './http/ApiCalledMapper'
import { WebhookCalledHttpTriggerMapper } from './http/WebhookCalledMapper'
import { PageCreatedNotionTriggerMapper } from './notion/PageCreatedMapper'

type TriggerMapperConfig = ITrigger & {
  automation: string
}

export interface TriggerMapperServices {
  server: Server
  queue: Queue
  realtime: Realtime
  schemaValidator: SchemaValidator
  templateCompiler: TemplateCompiler
  monitor: Monitor
}

export interface TriggerMapperIntegrations {
  notion: Notion
}

export class TriggerMapper {
  static toEntity(
    config: TriggerMapperConfig,
    services: TriggerMapperServices,
    integrations: TriggerMapperIntegrations
  ): Trigger {
    const { event } = config
    if (event === 'RecordCreated')
      return RecordCreatedDatabaseTriggerMapper.toEntity(config, services)
    if (event === 'WebhookCalled') return WebhookCalledHttpTriggerMapper.toEntity(config, services)
    if (event === 'ApiCalled') return ApiCalledHttpTriggerMapper.toEntity(config, services)
    if (event === 'PageCreated')
      return PageCreatedNotionTriggerMapper.toEntity(config, services, integrations)
    throw new Error(`TriggerMapper: trigger ${event} not found`)
  }

  static toManyEntities(
    configs: TriggerMapperConfig[],
    services: TriggerMapperServices,
    integrations: TriggerMapperIntegrations
  ): Trigger[] {
    return configs.map((config) => this.toEntity(config, services, integrations))
  }
}
