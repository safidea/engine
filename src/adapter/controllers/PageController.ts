import type { Drivers } from '@domain/drivers'
import { PageMiddleware } from '../middlewares/PageMiddleware'
import { Page } from '@domain/entities/page/Page'
import type { IController } from './IController'
import { ComponentList } from '@domain/entities/component/ComponentList'
import type { IComponent } from 'src/component'

export class PageController implements IController<Page> {
  private middleware: PageMiddleware

  constructor(
    drivers: Drivers,
    private params: { components: IComponent[] }
  ) {
    this.middleware = new PageMiddleware(drivers)
  }

  createEntity(data: unknown) {
    const { json, errors: schemaErrors } = this.middleware.validateSchema(data)
    if (!json ||schemaErrors) return { errors: schemaErrors }
    const components = new ComponentList(this.params.components)
    const entity = new Page(json, { components })
    const configError = entity.validateConfig()
    if (configError.length) return { errors: configError }
    return { entity }
  }
}
