import type { Drivers } from '@domain/drivers'
import { PageMiddleware } from '../middlewares/PageMiddleware'
import { Page } from '@domain/entities/page/Page'
import type { IController } from './IController'
import type { Components } from '@domain/components'
import { Controller } from './Controller'
import type { IPage } from '@domain/entities/page/IPage'
import { PageError } from '@domain/entities/page/PageError'

export class PageController extends Controller<IPage> implements IController<Page> {
  constructor(
    private drivers: Drivers,
    private params?: { components?: Partial<Components>; featureName?: string }
  ) {
    const middleware = new PageMiddleware(drivers)
    const log = drivers.logger.init('controller:page')
    super(middleware, log)
  }

  createEntity(data: unknown) {
    const schema = this.getSchemaWithErrors(data, (message) => new PageError(message))
    if (schema.errors) return { errors: schema.errors }
    const server = this.drivers.server.create()
    const entity = new Page(schema.json, {
      components: this.getComponents(this.params?.components),
      server,
      drivers: this.drivers,
      featureName: 'default',
    })
    const errors = this.getConfigErrors(entity)
    if (errors) return { errors }
    return { entity, errors: [] }
  }
}
