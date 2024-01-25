import type { Drivers } from '@domain/drivers'
import { FeatureMiddleware } from '../middlewares/FeatureMiddleware'
import { Feature } from '@domain/entities/feature/Feature'
import type { IController } from './IController'
import { RoleList } from '@domain/entities/role/RoleList'
import type { IRole } from '@domain/entities/role/IRole'
import type { Components } from '@domain/components'
import { Controller } from './Controller'
import type { IFeature } from '@domain/entities/feature/IFeature'
import { FeatureError } from '@domain/entities/feature/FeatureError'

export class FeatureController extends Controller<IFeature> implements IController<Feature> {
  constructor(
    private drivers: Drivers,
    private params?: { roles?: IRole[]; components?: Partial<Components> }
  ) {
    const middleware = new FeatureMiddleware(drivers)
    const log = drivers.logger.init('controller:feature')
    super(middleware, log)
  }

  createEntity(data: unknown) {
    const schema = this.getSchemaWithErrors(data, (message) => new FeatureError(message))
    if (schema.errors) return { errors: schema.errors }
    const roles = new RoleList(this.params?.roles ?? [])
    const entity = new Feature(schema.json, {
      drivers: this.drivers,
      roles,
      components: this.getComponents(this.params?.components),
    })
    const errors = this.getConfigErrors(entity)
    if (errors) return { errors }
    return { entity, errors: [] }
  }
}
