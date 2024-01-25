import type { Drivers } from '@domain/drivers'
import { PageMiddleware } from '../middlewares/PageMiddleware'
import { Page } from '@domain/entities/page/Page'
import type { IController } from './IController'
import { PageError } from '@domain/entities/page/PageError'
import type { Components } from '@domain/components'
import { Controller } from './Controller'
import type { ILoggerLog } from '@domain/drivers/ILogger'

export class PageController extends Controller implements IController<Page> {
  private log: ILoggerLog
  private middleware: PageMiddleware

  constructor(
    private drivers: Drivers,
    private params?: { components?: Partial<Components> }
  ) {
    super()
    this.middleware = new PageMiddleware(drivers)
    this.log = drivers.logger.init('controller:page')
  }

  // TODO: install the logger for all controllers
  createEntity(data: unknown) {
    const schema = this.middleware.validateSchema(data)
    if (schema.errors.length) {
      this.log(`Schema errors: ${JSON.stringify(schema.errors, null, 2)}`)
      return { errors: schema.errors }
    }
    if (!schema.json) {
      this.log('UNKNOWN_SCHEMA_ERROR')
      return { errors: [new PageError('UNKNOWN_SCHEMA_ERROR')] }
    }
    const server = this.drivers.server.create()
    const entity = new Page(schema.json, {
      components: this.getComponents(this.params?.components),
      server,
      drivers: this.drivers,
    })
    const configError = entity.validateConfig()
    if (configError.length) {
      this.log(`Config errors: ${JSON.stringify(configError, null, 2)}`)
      return { errors: configError }
    }
    this.log(`Page created: ${entity.name}`)
    return { entity, errors: [] }
  }
}
