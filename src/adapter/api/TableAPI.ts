import { Services } from '@domain/services'
import { SPIs, type Drivers } from '@adapter/spi'
import { TableMapper } from './mappers/TableMapper'
import type { Table, TableConfig } from '@domain/entities/table/Table'
import { TableError } from '@domain/entities/table/TableError'
import type { EngineError } from '@domain/entities/EngineError'

export interface CreateParams {
  drivers?: Partial<Drivers>
}

export interface CreateResult {
  entity?: Table
  errors: EngineError[]
}

export class TableAPI {
  constructor(private drivers: Drivers) {}

  async create(config: unknown, params?: CreateParams): Promise<CreateResult> {
    const services = new Services(new SPIs({ ...this.drivers, ...params?.drivers }))
    const schema = services.schemaValidator().validate<TableConfig>(config, 'table')
    if (schema.errors) return { errors: TableMapper.toErrorEntities(schema.errors) }
    if (!schema.json) return { errors: [new TableError('UNKNOWN_SCHEMA_ERROR')] }
    const entity = TableMapper.toEntity(schema.json, services)
    const errors = entity.validateConfig()
    if (errors.length > 0) return { errors }
    return { entity, errors: [] }
  }
}
