import { Services } from '@domain/services'
import { SPIs, type Drivers } from '@adapter/spi'
import { TableMapper } from './mappers/TableMapper'
import type { Table, TableConfig } from '@domain/entities/Table'
import { TableError } from '@domain/entities/TableError'

export class TableAPI {
  constructor(private drivers: Drivers) {}

  async create(
    config: unknown,
    params?: {
      drivers?: Partial<Drivers>
    }
  ): Promise<{
    table?: Table
    errors: TableError[]
  }> {
    const { drivers = {} } = params ?? {}
    const services = new Services(new SPIs({ ...this.drivers, ...drivers }))
    const schema = services.schemaValidator().validate<TableConfig>(config, 'table')
    if (schema.errors) return { errors: TableMapper.toErrorEntities(schema.errors) }
    if (!schema.json) return { errors: [new TableError('UNKNOWN_SCHEMA_ERROR')] }
    const table = TableMapper.toEntity(schema.json, services)
    const errors = table.validateConfig()
    if (errors.length > 0) return { errors }
    return { table, errors: [] }
  }
}
