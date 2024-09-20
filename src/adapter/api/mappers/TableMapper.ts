import { Table } from '@domain/entities/Table'
import type { Table as Config } from '@adapter/api/configs/Table'
import { FieldMapper } from './FieldMapper'
import type { Server } from '@domain/services/Server'
import type { Database } from '@domain/services/Database'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { SchemaValidator } from '@domain/services/SchemaValidator'
import { SingleLineTextMapper } from './FieldMapper/SingleLineTextMapper'
import { DateTimeMapper } from './FieldMapper/DateTimeMapper'
import type { Monitor } from '@domain/services/Monitor'

export interface Services {
  server: Server
  database: Database
  idGenerator: IdGenerator
  templateCompiler: TemplateCompiler
  schemaValidator: SchemaValidator
  monitor: Monitor
}

export class TableMapper {
  static toEntity = (config: Config, services: Services) => {
    const { name } = config
    const { server, database, idGenerator, templateCompiler, schemaValidator, monitor } = services
    const fields = FieldMapper.toManyEntities(config.fields)
    if (!fields.find((field) => field.name === 'id')) {
      fields.unshift(
        SingleLineTextMapper.toEntity({
          name: 'id',
          field: 'SingleLineText',
          required: true,
        })
      )
    }
    if (!fields.find((field) => field.name === 'created_at')) {
      fields.push(
        DateTimeMapper.toEntity({
          name: 'created_at',
          field: 'DateTime',
          required: true,
        })
      )
    }
    if (!fields.find((field) => field.name === 'updated_at')) {
      fields.push(
        DateTimeMapper.toEntity({
          name: 'updated_at',
          field: 'DateTime',
        })
      )
    }
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

  static toManyEntities = (configs: Config[] = [], services: Services) => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
