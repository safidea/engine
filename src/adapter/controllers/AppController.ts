import type { Drivers } from '@domain/drivers'
import { AppMiddleware } from '../middlewares/AppMiddleware'
import { App } from '@domain/entities/app/App'
import type { IController } from './IController'
import type { Components } from '@domain/components'
import { Controller } from './Controller'
import type { IApp } from '@domain/entities/app/IApp'
import { AppError } from '@domain/entities/app/AppError'

export class AppController extends Controller<IApp> implements IController<App> {
  constructor(
    private drivers: Drivers,
    private params?: { components?: Partial<Components>; port?: number }
  ) {
    const middleware = new AppMiddleware(drivers)
    const log = drivers.logger.init('controller:app')
    super(middleware, log)
  }

  createEntity(data: unknown) {
    const schema = this.getSchemaWithErrors(data, (message) => new AppError(message))
    if (schema.errors) return { errors: schema.errors }
    const { components, port } = this.params ?? {}
    const entity = new App(schema.json, {
      drivers: this.drivers,
      components: this.getComponents(components),
      port,
    })
    const errors = this.getConfigErrors(entity)
    if (errors) return { errors }
    return { entity, errors: [] }
  }
}
