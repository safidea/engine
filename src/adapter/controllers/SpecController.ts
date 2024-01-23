import type { Drivers } from '@domain/drivers'
import { SpecMiddleware } from '../middlewares/SpecMiddleware'
import { Spec } from '@domain/entities/spec/Spec'
import type { IController } from './IController'

export class SpecController implements IController<Spec> {
  private middleware: SpecMiddleware

  constructor(private drivers: Drivers) {
    this.middleware = new SpecMiddleware(drivers)
  }

  createEntity(data: unknown) {
    const { json, errors: schemaErrors } = this.middleware.validateSchema(data)
    if (!json || schemaErrors) return { errors: schemaErrors }
    const entity = new Spec(json, { drivers: this.drivers })
    const configError = entity.validateConfig()
    if (configError.length) return { errors: configError }
    return { entity }
  }
}
