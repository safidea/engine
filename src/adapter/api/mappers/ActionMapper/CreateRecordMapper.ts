import type { CreateRecord as CreateRecordConfig } from '@adapter/api/configs/Action/CreateRecord'
import { CreateRecord } from '@domain/entities/Action/CreateRecord'
import { ConfigError } from '@domain/entities/Error/Config'
import { ToCreate } from '@domain/entities/Record/ToCreate'
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
    const { idGenerator, templateCompiler } = services
    const { tables } = entities
    const table = tables.find((table) => table.name === config.table)
    if (!table)
      throw new ConfigError({ message: `CreateRecordMapper: Table ${config.table} not found` })
    const recordToCreate = new ToCreate(config.fields, { idGenerator, templateCompiler })
    return new CreateRecord({ ...config, recordToCreate, table })
  }
}
