import { Table } from '@domain/entities/Table'
import type { Table as Config } from '@adapter/api/configs/Table'
import { FieldMapper } from './FieldMapper'
import type { Server } from '@domain/services/Server'
import type { Logger } from '@domain/services/Logger'
import type { Database } from '@domain/services/Database'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { SchemaValidator } from '@domain/services/SchemaValidator'

export interface Services {
  logger: Logger
  server: Server
  database: Database
  idGenerator: IdGenerator
  templateCompiler: TemplateCompiler
  schemaValidator: SchemaValidator
}

export class TableMapper {
  static toEntity = (config: Config, services: Services) => {
    const { name } = config
    const { server, database, logger, idGenerator, templateCompiler, schemaValidator } = services
    const fields = FieldMapper.toManyEntities(config.fields)
    if (!fields.find((field) => field.name === 'id')) {
      fields.unshift(
        FieldMapper.toEntity({
          name: 'id',
          field: 'SingleLineText',
          required: true,
        })
      )
    }
    if (!fields.find((field) => field.name === 'created_at')) {
      fields.push(
        FieldMapper.toEntity({
          name: 'created_at',
          field: 'DateTime',
          required: true,
        })
      )
    }
    if (!fields.find((field) => field.name === 'updated_at')) {
      fields.push(
        FieldMapper.toEntity({
          name: 'updated_at',
          field: 'DateTime',
        })
      )
    }
    return new Table({
      name,
      fields,
      server,
      database,
      logger,
      idGenerator,
      templateCompiler,
      schemaValidator,
    })
  }

  static toManyEntities = (configs: Config[], services: Services) => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
