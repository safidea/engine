import type { Drivers } from '@domain/drivers'
import { PageMiddleware } from '../middlewares/PageMiddleware'
import { Page } from '@domain/entities/page/Page'
import type { IController } from './IController'
import { PageError } from '@domain/entities/page/PageError'
import type { Components } from '@domain/components'
import { Controller } from './Controller'

export class PageController extends Controller implements IController<Page> {
  private middleware: PageMiddleware

  constructor(
    private drivers: Drivers,
    private params?: { components?: Components }
  ) {
    super()
    this.middleware = new PageMiddleware(drivers)
  }

  createEntity(data: unknown) {
    const schema = this.middleware.validateSchema(data)
    if (schema.errors.length) return { errors: schema.errors }
    if (!schema.json) return { errors: [new PageError('UNKNOWN_SCHEMA_ERROR')] }
    const server = this.drivers.server.create()
    const entity = new Page(schema.json, {
      components: this.getComponents(this.params?.components),
      server,
      drivers: this.drivers,
    })
    const configError = entity.validateConfig()
    if (configError.length) return { errors: configError }
    return { entity, errors: [] }
  }
}
