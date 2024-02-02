import { type Drivers } from '@adapter/spi'
import { TableMapper } from './mappers/TableMapper'
import type { Table } from '@domain/entities/Table'
import { TableError } from '@domain/entities/TableError'
import type { ReactComponents } from '@domain/entities/Component'
import { Api, type ApiParams } from './Api'
import type { TableDto } from './dtos/TableDto'

export class TableApi extends Api {
  constructor(drivers: Drivers, components: ReactComponents) {
    super(drivers, components)
  }

  async create(
    config: unknown,
    params?: ApiParams
  ): Promise<{
    table?: Table
    errors: TableError[]
  }> {
    const services = this.services(params)
    const schema = services.schemaValidator().validate<TableDto>(config, 'table')
    if (schema.errors) return { errors: TableMapper.toErrorEntities(schema.errors) }
    if (!schema.json) return { errors: [new TableError('UNKNOWN_SCHEMA_ERROR')] }
    const table = TableMapper.toEntity(schema.json, services)
    const errors = table.validateConfig()
    if (errors.length > 0) return { errors }
    return { table, errors: [] }
  }
}
