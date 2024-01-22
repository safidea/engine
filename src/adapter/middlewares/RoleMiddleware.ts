import type { Drivers } from '@domain/drivers'
import type { IRole } from '@domain/entities/role/IRole'
import { RoleError } from '@domain/entities/role/RoleError'
import type { IMiddleware } from './IMiddleware'

export class RoleMiddleware implements IMiddleware<IRole> {
  constructor(private drivers: Drivers) {}

  validateSchema(data: unknown) {
    const { json, errors: schemaValidatorErrors } =
      this.drivers.schemaValidator.validateSchema<IRole>(data, 'role')
    if (json) return { json }
    const errors = schemaValidatorErrors?.map((error) => {
      const { instancePath, keyword, params } = error
      if (keyword === 'required') {
        if (params.missingProperty === 'name') return new RoleError('NAME_REQUIRED')
      } else if (keyword === 'additionalProperties') {
        return new RoleError('UNKNOWN_PROPERTY', { property: params.additionalProperty })
      } else if (keyword === 'type') {
        if (instancePath === '/name') return new RoleError('NAME_STRING_TYPE_REQUIRED')
      }
      throw new Error('Unknown AJV error: ' + JSON.stringify(error, null, 2))
    })
    return { errors }
  }
}
