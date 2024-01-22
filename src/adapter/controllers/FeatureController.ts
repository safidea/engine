import type { Drivers } from '@domain/drivers'
import { FeatureMiddleware } from '../middlewares/FeatureMiddleware'
import { Feature } from '@domain/entities/feature/Feature'
import type { IController } from './IController'
import { ComponentList } from '@domain/entities/component/ComponentList'
import { RoleList } from '@domain/entities/role/RoleList'
import type { IRole } from '@domain/entities/role/IRole'
import type { IComponent } from '@domain/entities/component/IComponent'

export class FeatureController implements IController<Feature> {
  private middleware: FeatureMiddleware

  constructor(
    private drivers: Drivers,
    private params: { roles: IRole[]; components: IComponent[] }
  ) {
    this.middleware = new FeatureMiddleware(drivers)
  }

  createEntity(data: unknown) {
    const { json, errors: schemaErrors } = this.middleware.validateSchema(data)
    if (!json ||schemaErrors) return { errors: schemaErrors }
    const roles = new RoleList(this.params.roles)
    const components = new ComponentList(this.params.components)
    const entity = new Feature(json, { drivers: this.drivers, roles, components })
    const configError = entity.validateConfig()
    if (configError.length) return { errors: configError }
    return { entity }
  }
}
