import type { Drivers } from '@domain/drivers'
import { RoleMiddleware } from '../middlewares/RoleMiddleware'
import { Role } from '@domain/entities/role/Role'
import type { IController } from './IController'

export class RoleController implements IController<Role> {
  private middleware: RoleMiddleware

  constructor(drivers: Drivers) {
    this.middleware = new RoleMiddleware(drivers)
  }

  createEntity(data: unknown) {
    const { json, errors: schemaErrors } = this.middleware.validateSchema(data)
    if (!json ||schemaErrors) return { errors: schemaErrors }
    const entity = new Role(json)
    const configError = entity.validateConfig()
    if (configError.length) return { errors: configError }
    return { entity }
  }
}
