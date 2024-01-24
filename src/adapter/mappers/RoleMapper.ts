import type { ISchemaValidatorError } from '@domain/drivers/ISchemaValidator'
import { RoleError } from '@domain/entities/role/RoleError'
import type { IMapper } from './IMapper'

export class RoleMapper implements IMapper {
  schemaValidatorToEngineErrors(errors: ISchemaValidatorError[]) {
    return errors.map((error) => {
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
  }
}
