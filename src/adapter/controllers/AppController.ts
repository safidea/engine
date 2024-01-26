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
    private params?: {
      components?: Partial<Components>
      port?: number
      testSpecs?: boolean
    }
  ) {
    const middleware = new AppMiddleware(drivers)
    const log = drivers.logger.init('controller:app')
    super(middleware, log)
  }

  async createEntity(data: unknown) {
    const { json, errors: schemaErrors } = this.getSchemaWithErrors(
      data,
      (message) => new AppError(message)
    )
    if (schemaErrors) return { errors: schemaErrors }
    const { components, port, testSpecs = true } = this.params ?? {}
    const entity = new App(json, {
      drivers: this.drivers,
      components: this.getComponents(components),
      port,
    })
    const configErrors = this.getConfigErrors(entity)
    if (configErrors) return { errors: configErrors }
    if (testSpecs === true) {
      const specsErrors = await entity.testFeaturesSpecs()
      if (specsErrors.length > 0) return { errors: specsErrors }
    }
    return { entity, errors: [] }
  }
}
