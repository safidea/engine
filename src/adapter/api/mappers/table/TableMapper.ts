import { Table } from '@domain/entities/table/Table'
import { TableError, type TableErrorCode } from '@domain/entities/table/TableError'
import { Services } from '@domain/services'
import type { SchemaValidatorErrorDto } from '@adapter/spi/dtos/SchemaValidatorErrorDto'
import type { Table as TableConfig } from '../../configs/table/Table'
import type { Mapper } from '../Mapper'
import { FieldMapper } from './FieldMapper'
import type { Server } from '@domain/services/Server'
import type { Logger } from '@domain/services/Logger'
import type { Database } from '@domain/services/Database'
import type { Record } from '@domain/entities/record'

export interface Params {
  newLogger: (location: string) => Logger
  server: Server
  database: Database
  record: Record
}

export const TableMapper: Mapper<TableConfig, TableError, Table, Params> = class TableMapper {
  static toEntity = (config: TableConfig, params: Params) => {
    const { name } = config
    const { server, database, newLogger, record } = params
    const logger = newLogger(`table:${config.name}`)
    const fields = FieldMapper.toManyEntities(config.fields)
    if (!fields.find((field) => field.name === 'id')) {
      fields.unshift(
        FieldMapper.toEntity({
          name: 'id',
          type: 'SingleLineText',
        })
      )
    }
    if (!fields.find((field) => field.name === 'created_at')) {
      fields.push(
        FieldMapper.toEntity({
          name: 'created_at',
          type: 'DateTime',
        })
      )
    }
    if (!fields.find((field) => field.name === 'updated_at')) {
      fields.push(
        FieldMapper.toEntity({
          name: 'updated_at',
          type: 'DateTime',
        })
      )
    }
    return new Table({ name, fields, server, database, logger, record })
  }

  static toManyEntities = (configs: TableConfig[], params: Params) => {
    return configs.map((config) => this.toEntity(config, params))
  }

  static toEntityFromServices = (config: TableConfig, services: Services) => {
    const server = services.server({
      logger: services.logger({ location: `server` }),
    })
    const database = services.database({
      logger: services.logger({ location: `database` }),
      url: config.database?.url ?? ':memory:',
      database: config.database?.database ?? 'sqlite',
    })
    const newLogger = (location: string) => services.logger({ location })
    const record = services.record()
    return this.toEntity(config, { server, database, newLogger, record })
  }

  static toManyEntitiesFromServices = (configs: TableConfig[], services: Services) => {
    return configs.map((config) => this.toEntityFromServices(config, services))
  }

  static toErrorEntity = (errorDto: SchemaValidatorErrorDto) => {
    const { instancePath, keyword, params } = errorDto
    if (keyword === 'required') {
      if (params.missingProperty === 'name') return new TableError('NAME_REQUIRED')
      if (params.missingProperty === 'fields') return new TableError('FIELDS_REQUIRED')
    } else if (keyword === 'additionalProperties') {
      return new TableError('UNKNOWN_PROPERTY', { property: params.additionalProperty })
    } else if (keyword === 'type') {
      if (instancePath === '/name') return new TableError('NAME_STRING_TYPE_REQUIRED')
    }
    return new TableError('UNKNOWN_SCHEMA_ERROR')
  }

  static toManyErrorEntities = (errorDtos: SchemaValidatorErrorDto[]) => {
    return errorDtos.map(this.toErrorEntity)
  }

  static toErrorEntityFromCode = (code: TableErrorCode) => {
    return new TableError(code)
  }
}
