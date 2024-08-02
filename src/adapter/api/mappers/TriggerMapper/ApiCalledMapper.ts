import type { ApiCalled as Config } from '@adapter/api/configs/Trigger/ApiCalled'
import type { Queue } from '@domain/services/Queue'
import type { Realtime } from '@domain/services/Realtime'
import type { Server } from '@domain/services/Server'
import { ApiCalled } from '@domain/entities/Trigger/ApiCalled'
import type { SchemaValidator } from '@domain/services/SchemaValidator'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

interface Services {
  queue: Queue
  realtime: Realtime
  server: Server
  schemaValidator: SchemaValidator
  templateCompiler: TemplateCompiler
}

export class ApiCalledMapper {
  static toEntity = (config: Config, services: Services): ApiCalled => {
    return new ApiCalled(config, services)
  }

  static toManyEntities = (configs: Config[], services: Services): ApiCalled[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
