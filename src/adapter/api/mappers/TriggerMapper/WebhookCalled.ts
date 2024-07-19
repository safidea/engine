import { WebhookCalled } from '@domain/entities/Trigger/WebhookCalled'
import type { WebhookCalled as Config } from '@adapter/api/configs/Trigger/WebhookCalled'
import type { Queue } from '@domain/services/Queue'
import type { Realtime } from '@domain/services/Realtime'
import type { Server } from '@domain/services/Server'

interface MapperConfig extends Config {
  automation: string
}

interface Services {
  queue: Queue
  realtime: Realtime
  server: Server
}

export class WebhookCalledMapper {
  static toEntity = (config: MapperConfig, services: Services): WebhookCalled => {
    return new WebhookCalled(config, services)
  }

  static toManyEntities = (configs: MapperConfig[], services: Services): WebhookCalled[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
