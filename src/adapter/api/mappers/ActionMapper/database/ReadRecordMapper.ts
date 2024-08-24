import type { ReadRecord as ReadRecordConfig } from '@adapter/api/configs/Action/database/ReadRecord'
import { ReadRecord } from '@domain/entities/Action/database/ReadRecord'
import { ConfigError } from '@domain/entities/Error/Config'
import type { Table } from '@domain/entities/Table'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

interface Services {
  templateCompiler: TemplateCompiler
}

interface Entities {
  tables: Table[]
}

export class ReadRecordMapper {
  static toEntity = (
    config: ReadRecordConfig,
    services: Services,
    entities: Entities
  ): ReadRecord => {
    const { templateCompiler } = services
    const { tables } = entities
    const table = tables.find((table) => table.name === config.table)
    if (!table)
      throw new ConfigError({ message: `ReadRecordMapper: Table ${config.table} not found` })
    return new ReadRecord({ ...config, table, templateCompiler })
  }
}
