import { Table } from '@domain/entities/table/Table'
import { TableError, type TableErrorCode } from '@domain/entities/table/TableError'
import { Services } from '@domain/services'
import type { SchemaValidatorErrorDto } from '@adapter/spi/dtos/SchemaValidatorErrorDto'
import type { Table as TableConfig } from '../../configs/table/Table'
import type { Mapper } from '../Mapper'
import { FieldMapper } from './FieldMapper'

export const TableMapper: Mapper<TableConfig, TableError, Table> = class TableMapper {
  static toEntity = (config: TableConfig, services: Services, feature: string) => {
    const { name } = config
    const server = services.server()
    const database = services.database()
    const logger = services.logger(`feature:${feature}:table:${config.name}`)
    const record = services.record()
    const fields = FieldMapper.toManyEntities(config.fields)
    return new Table({ name, fields, server, database, logger, record })
  }

  static toManyEntities = (configs: TableConfig[], services: Services, feature: string) => {
    return configs.map((config) => this.toEntity(config, services, feature))
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
