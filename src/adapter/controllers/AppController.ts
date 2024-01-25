import type { Drivers } from '@domain/drivers'
import { AppMiddleware } from '../middlewares/AppMiddleware'
import { App } from '@domain/entities/app/App'
import type { IController } from './IController'
import { AppError } from 'src/app'
import type { Components } from '@domain/components'
import { Controller } from './Controller'

export class AppController extends Controller implements IController<App> {
  private middleware: AppMiddleware

  constructor(
    private drivers: Drivers,
    private params?: { components?: Partial<Components> }
  ) {
    super()
    this.middleware = new AppMiddleware(drivers)
  }

  createEntity(data: unknown) {
    const schema = this.middleware.validateSchema(data)
    if (schema.errors.length) return { errors: schema.errors }
    if (!schema.json) return { errors: [new AppError('UNKNOWN_SCHEMA_ERROR')] }
    const entity = new App(schema.json, {
      drivers: this.drivers,
      components: this.getComponents(this.params?.components),
    })
    const errors = entity.validateConfig()
    if (errors.length) return { errors }
    return { entity, errors: [] }
  }
}
