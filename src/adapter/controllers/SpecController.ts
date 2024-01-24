import type { Drivers } from '@domain/drivers'
import { SpecMiddleware } from '../middlewares/SpecMiddleware'
import { Spec } from '@domain/entities/spec/Spec'
import type { IController } from './IController'
import { SpecError } from '@domain/entities/spec/SpecError'

export class SpecController implements IController<Spec> {
  private middleware: SpecMiddleware

  constructor(private drivers: Drivers) {
    this.middleware = new SpecMiddleware(drivers)
  }

  createEntity(data: unknown) {
    const schema = this.middleware.validateSchema(data)
    if (schema.errors.length) return { errors: schema.errors }
    if (!schema.json) return { errors: [new SpecError('UNKNOWN_SCHEMA_ERROR')] }
    const entity = new Spec(schema.json, { drivers: this.drivers })
    const errors = entity.validateConfig()
    if (errors.length) return { errors }
    return { entity, errors: [] }
  }
}
