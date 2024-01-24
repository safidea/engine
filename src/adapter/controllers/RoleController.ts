import type { Drivers } from '@domain/drivers'
import { RoleMiddleware } from '../middlewares/RoleMiddleware'
import { Role } from '@domain/entities/role/Role'
import type { IController } from './IController'
import { RoleError } from '@domain/entities/role/RoleError'

export class RoleController implements IController<Role> {
  private middleware: RoleMiddleware

  constructor(drivers: Drivers) {
    this.middleware = new RoleMiddleware(drivers)
  }

  createEntity(data: unknown) {
    const schema = this.middleware.validateSchema(data)
    if (schema.errors.length) return { errors: schema.errors }
    if (!schema.json) return { errors: [new RoleError('UNKNOWN_SCHEMA_ERROR')] }
    const entity = new Role(schema.json)
    const errors = entity.validateConfig()
    if (errors.length) return { errors }
    return { entity, errors: [] }
  }
}
