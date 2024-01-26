import type { Drivers } from '@domain/drivers'
import { RoleMiddleware } from '../middlewares/RoleMiddleware'
import { Role } from '@domain/entities/role/Role'
import type { IController } from './IController'
import { RoleError } from '@domain/entities/role/RoleError'
import type { IRole } from '@domain/entities/role/IRole'
import { Controller } from './Controller'

export class RoleController extends Controller<IRole> implements IController<Role> {
  constructor(drivers: Drivers) {
    const middleware = new RoleMiddleware(drivers)
    const log = drivers.logger.init('controller:role')
    super(middleware, log)
  }

  async createEntity(data: unknown) {
    const schema = this.getSchemaWithErrors(data, (message) => new RoleError(message))
    if (schema.errors) return { errors: schema.errors }
    const entity = new Role(schema.json)
    const errors = this.getConfigErrors(entity)
    if (errors) return { errors }
    return { entity, errors: [] }
  }
}
