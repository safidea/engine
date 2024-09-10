import type { CreateRecord as CreateRecordConfig } from '@adapter/api/configs/Action/database/CreateRecord'
import { CreateRecord } from '@domain/entities/Action/database/CreateRecord'
import type { Table } from '@domain/entities/Table'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

interface Services {
  idGenerator: IdGenerator
  templateCompiler: TemplateCompiler
}

interface Entities {
  tables: Table[]
}

export class CreateRecordMapper {
  static toEntity = (
    config: CreateRecordConfig,
    services: Services,
    entities: Entities
  ): CreateRecord => {
    return new CreateRecord(config, services, entities)
  }
}
