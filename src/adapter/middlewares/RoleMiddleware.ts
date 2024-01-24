import type { Drivers } from '@domain/drivers'
import type { IRole } from '@domain/entities/role/IRole'
import type { IMiddleware } from './IMiddleware'
import { RoleMapper } from '../mappers/RoleMapper'

export class RoleMiddleware implements IMiddleware<IRole> {
  private mapper = new RoleMapper()

  constructor(private drivers: Drivers) {}

  validateSchema(data: unknown) {
    const { json, errors } = this.drivers.schemaValidator.validateSchema<IRole>(data, 'role')
    if (json) return { json }
    if (!errors) return { errors: [] }
    return { errors: this.mapper.schemaValidatorToEngineErrors(errors) }
  }
}
