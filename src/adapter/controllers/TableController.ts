import type { Drivers } from '@domain/drivers'
import { TableMiddleware } from '../middlewares/TableMiddleware'
import { Table } from '@domain/entities/table/Table'
import type { IController } from './IController'
import { Controller } from './Controller'
import type { ITable } from '@domain/entities/table/ITable'
import { TableError } from '@domain/entities/table/TableError'

export class TableController extends Controller<ITable> implements IController<Table> {
  constructor(private drivers: Drivers) {
    const middleware = new TableMiddleware(drivers)
    const log = drivers.logger.init('controller:table')
    super(middleware, log)
  }

  async createEntity(data: unknown) {
    const schema = this.getSchemaWithErrors(data, (message) => new TableError(message))
    if (schema.errors) return { errors: schema.errors }
    const entity = new Table(schema.json, {
      drivers: this.drivers,
      featureName: 'default',
    })
    const errors = this.getConfigErrors(entity)
    if (errors) return { errors }
    return { entity, errors: [] }
  }
}
