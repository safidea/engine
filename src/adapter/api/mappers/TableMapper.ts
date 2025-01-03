import { Table } from '@domain/entities/Table'
import type { ITable } from '@adapter/api/configs/Table'
import { FieldMapper } from './Field'
import type { Server } from '@domain/services/Server'
import type { Database } from '@domain/services/Database'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { SchemaValidator } from '@domain/services/SchemaValidator'
import type { Monitor } from '@domain/services/Monitor'

export interface TableMapperServices {
  server: Server
  database: Database
  idGenerator: IdGenerator
  templateCompiler: TemplateCompiler
  schemaValidator: SchemaValidator
  monitor: Monitor
}

export class TableMapper {
  static toEntity = (config: ITable, services: TableMapperServices) => {
    const { name } = config
    const { server, database, idGenerator, templateCompiler, schemaValidator, monitor } = services
    const fields = FieldMapper.toManyEntities(config.fields)
    return new Table(
      {
        name,
      },
      {
        server,
        database,
        idGenerator,
        templateCompiler,
        schemaValidator,
        monitor,
      },
      { fields }
    )
  }

  static toManyEntities = (configs: ITable[] = [], services: TableMapperServices) => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
