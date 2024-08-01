import type { ApiCalled as Config } from '@adapter/api/configs/Trigger/ApiCalled'
import type { Queue } from '@domain/services/Queue'
import type { Realtime } from '@domain/services/Realtime'
import type { Server } from '@domain/services/Server'
import { ApiCalled } from '@domain/entities/Trigger/ApiCalled'
import type { SchemaValidator } from '@domain/services/SchemaValidator'

interface MapperConfig extends Config {
  automation: string
}

interface Services {
  queue: Queue
  realtime: Realtime
  server: Server
  schemaValidator: SchemaValidator
}

export class ApiCalledMapper {
  static toEntity = (config: MapperConfig, services: Services): ApiCalled => {
    return new ApiCalled(config, services)
  }

  static toManyEntities = (configs: MapperConfig[], services: Services): ApiCalled[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
