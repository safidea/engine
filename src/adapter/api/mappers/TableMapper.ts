import { Table } from '@domain/entities/Table'
import type { ITable } from '@adapter/api/configs/Table'
import { FieldMapper } from './Field'
import type { Server } from '@domain/services/Server'
import type { Database } from '@domain/services/Database'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { SchemaValidator } from '@domain/services/SchemaValidator'
import { SingleLineTextFieldMapper } from './Field/SingleLineTextMapper'
import { DateTimeFieldMapper } from './Field/DateTimeMapper'
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
    if (!fields.find((field) => field.name === 'id')) {
      fields.unshift(
        SingleLineTextFieldMapper.toEntity({
          name: 'id',
          field: 'SingleLineText',
          required: true,
        })
      )
    }
    if (!fields.find((field) => field.name === 'created_at')) {
      fields.push(
        DateTimeFieldMapper.toEntity({
          name: 'created_at',
          field: 'DateTime',
          required: true,
        })
      )
    }
    if (!fields.find((field) => field.name === 'updated_at')) {
      fields.push(
        DateTimeFieldMapper.toEntity({
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

  static toManyEntities = (configs: ITable[] = [], services: TableMapperServices) => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
