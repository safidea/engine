import type { ISchemaValidatorError } from '@domain/drivers/ISchemaValidator'
import { SpecError } from '@domain/entities/spec/SpecError'
import type { IMapper } from './IMapper'

export class SpecMapper implements IMapper {
  schemaValidatorToEngineErrors(errors: ISchemaValidatorError[]) {
    return errors.map((error) => {
      const { instancePath, keyword, params } = error
      if (keyword === 'required') {
        if (params.missingProperty === 'name') return new SpecError('NAME_REQUIRED')
        if (params.missingProperty === 'when') return new SpecError('WHEN_REQUIRED')
        if (params.missingProperty === 'then') return new SpecError('THEN_REQUIRED')
      } else if (keyword === 'additionalProperties') {
        return new SpecError('UNKNOWN_PROPERTY', { property: params.additionalProperty })
      } else if (keyword === 'type') {
        if (instancePath === '/name') return new SpecError('NAME_STRING_TYPE_REQUIRED')
      }
      throw new Error('Unknown AJV error: ' + JSON.stringify(error, null, 2))
    })
  }
}
