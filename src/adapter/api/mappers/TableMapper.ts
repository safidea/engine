import type { TableDto } from '@domain/entities/table/TableDto'
import { Table } from '@domain/entities/table/Table'
import { TableError } from '@domain/entities/table/TableError'
import { Services } from '@domain/services/Services'
import type { SchemaValidatorErrorDto } from 'src/adapter/spi/dtos/SchemaValidatorErrorDto'

export class TableMapper {
  static toEntity(tableDto: TableDto, services: Services) {
    const server = services.server()
    const database = services.database()
    const logger = services.logger(`table:${tableDto.name}`)
    return new Table(tableDto, { services, server, database, logger })
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
  }

  static toErrorEntities(errorDtos: SchemaValidatorErrorDto[]) {
    return errorDtos.map(TableMapper.toErrorEntity)
  }
}
