import type { ISchemaValidatorError } from '@domain/drivers/ISchemaValidator'
import { RoleError } from '@domain/entities/role/RoleError'
import type { IMapper } from './IMapper'
import { Mapper } from './Mapper'

export class RoleMapper extends Mapper implements IMapper {
  schemaValidatorToEngineError = (error: ISchemaValidatorError) => {
    const { instancePath, keyword, params } = error
    if (keyword === 'required') {
      if (params.missingProperty === 'name') return new RoleError('NAME_REQUIRED')
    } else if (keyword === 'additionalProperties') {
      return new RoleError('UNKNOWN_PROPERTY', { property: params.additionalProperty })
    } else if (keyword === 'type') {
      if (instancePath === '/name') return new RoleError('NAME_STRING_TYPE_REQUIRED')
    }
  }

  schemaValidatorToEngineErrors = (errors: ISchemaValidatorError[]) => {
    return this.mapSchemaValidatorToEngineErrors(errors, this.schemaValidatorToEngineError)
  }
}
