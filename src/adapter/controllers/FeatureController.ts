import type { Drivers } from '@domain/drivers'
import { FeatureMiddleware } from '../middlewares/FeatureMiddleware'
import { Feature } from '@domain/entities/feature/Feature'
import type { IController } from './IController'
import { RoleList } from '@domain/entities/role/RoleList'
import type { IRole } from '@domain/entities/role/IRole'
import { FeatureError } from 'src/feature'
import type { Components } from '@domain/components'
import { Controller } from './Controller'

export class FeatureController extends Controller implements IController<Feature> {
  private middleware: FeatureMiddleware

  constructor(
    private drivers: Drivers,
    private params?: { roles?: IRole[]; components?: Components }
  ) {
    super()
    this.middleware = new FeatureMiddleware(drivers)
  }

  createEntity(data: unknown) {
    const schema = this.middleware.validateSchema(data)
    if (schema.errors.length) return { errors: schema.errors }
    if (!schema.json) return { errors: [new FeatureError('UNKNOWN_SCHEMA_ERROR')] }
    const roles = new RoleList(this.params?.roles ?? [])
    const entity = new Feature(schema.json, {
      drivers: this.drivers,
      roles,
      components: this.getComponents(this.params?.components),
    })
    const errors = entity.validateConfig()
    if (errors.length) return { errors }
    return { entity, errors: [] }
  }
}
