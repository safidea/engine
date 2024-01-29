import type { Drivers } from '@domain/drivers'
import type { ITable } from '@domain/entities/table/ITable'
import type { IMiddleware } from './IMiddleware'
import { TableMapper } from '../mappers/TableMapper'

export class TableMiddleware implements IMiddleware<ITable> {
  private mapper = new TableMapper()

  constructor(private drivers: Drivers) {}

  validateSchema(data: unknown) {
    const { json, errors } = this.drivers.schemaValidator.validateSchema<ITable>(data, 'table')
    return { json, errors: this.mapper.schemaValidatorToEngineErrors(errors) }
  }
}
