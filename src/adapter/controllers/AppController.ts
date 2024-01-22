import type { Drivers } from '@domain/drivers'
import { AppMiddleware } from '../middlewares/AppMiddleware'
import { App } from '@domain/entities/app/App'
import type { IController } from './IController'

export class AppController implements IController<App> {
  private middleware: AppMiddleware

  constructor(private drivers: Drivers) {
    this.middleware = new AppMiddleware(drivers)
  }

  createEntity(data: unknown) {
    const { json, errors: schemaErrors } = this.middleware.validateSchema(data)
    if (!json || schemaErrors) return { errors: schemaErrors }
    const entity = new App(json, { drivers: this.drivers })
    const configError = entity.validateConfig()
    if (configError.length) return { errors: configError }
    return { entity }
  }
}
