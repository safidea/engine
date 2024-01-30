import type { IDrivers } from '@adapter/spi/drivers/IDrivers'
import { Services } from '@domain/services/Services'
import { ServicesMappers } from '@adapter/spi/mappers/ServicesMappers'
import { TableMapper } from '../mappers/TableMapper'
import type { TableDto } from '@domain/entities/table/TableDto'

export class TableController {
  private services: Services

  constructor(drivers: IDrivers) {
    this.services = new Services(new ServicesMappers(drivers))
  }

  async create(config: unknown) {
    const schema = this.services.schemaValidator().validate<TableDto>(config, 'table')
    if (schema.errors) return { errors: schema.errors }
    const entity = TableMapper.toEntity(schema.json, this.services)
    const errors = entity.validateConfig()
    if (errors.length > 0) return { errors }
    return { entity, errors: [] }
  }
}
