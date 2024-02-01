import { Table } from '@domain/entities/table/Table'
import { TableError } from '@domain/entities/table/TableError'
import { Services } from '@domain/services'
import type { SchemaValidatorErrorDto } from 'src/adapter/spi/dtos/SchemaValidatorErrorDto'
import type { TableDto } from '../dtos/TableDto'

export class TableMapper {
  static toEntity(dto: TableDto, services: Services) {
    const server = services.server()
    const database = services.database()
    const logger = services.logger(`table:${dto.name}`)
    return new Table(dto, { services, server, database, logger })
  }

  static toErrorEntity(errorDto: SchemaValidatorErrorDto) {
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

  static toErrorEntities(errorDtos: SchemaValidatorErrorDto[]) {
    return errorDtos.map(TableMapper.toErrorEntity)
  }
}
