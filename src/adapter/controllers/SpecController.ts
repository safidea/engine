import type { Drivers } from '@domain/drivers'
import { SpecMiddleware } from '../middlewares/SpecMiddleware'
import { Spec } from '@domain/entities/spec/Spec'
import type { IController } from './IController'
import { SpecError } from '@domain/entities/spec/SpecError'
import { Controller } from './Controller'
import type { ISpec } from '@domain/entities/spec/ISpec'
import type { ITable } from '@domain/entities/table/ITable'
import { TableList } from '@domain/entities/table/TableList'

export class SpecController extends Controller<ISpec> implements IController<Spec> {
  constructor(
    private drivers: Drivers,
    private params?: {
      featureName?: string
      tables?: ITable[]
    }
  ) {
    const middleware = new SpecMiddleware(drivers)
    const log = drivers.logger.init('controller:spec')
    super(middleware, log)
  }

  async createEntity(data: unknown) {
    const schema = this.getSchemaWithErrors(data, (message) => new SpecError(message))
    if (schema.errors) return { errors: schema.errors }
    const featureName = this.params?.featureName ?? 'default'
    const tables = new TableList(this.params?.tables ?? [], {
      drivers: this.drivers,
      featureName,
    })
    const databaseInstance = this.drivers.database.create(tables)
    const entity = new Spec(schema.json, {
      drivers: this.drivers,
      featureName,
      databaseInstance,
    })
    const errors = this.getConfigErrors(entity)
    if (errors) return { errors }
    return { entity, errors: [] }
  }
}
