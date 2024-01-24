import type { ISchemaValidatorError } from '@domain/drivers/ISchemaValidator'
import { PageError } from '@domain/entities/page/PageError'
import type { IMapper } from './IMapper'

export class PageMapper implements IMapper {
  schemaValidatorToEngineErrors(errors: ISchemaValidatorError[]) {
    return errors.map((error) => {
      const { instancePath, keyword, params } = error
      if (keyword === 'required') {
        if (params.missingProperty === 'name') return new PageError('NAME_REQUIRED')
        if (params.missingProperty === 'path') return new PageError('PATH_REQUIRED')
        if (params.missingProperty === 'body') return new PageError('BODY_REQUIRED')
      } else if (keyword === 'additionalProperties') {
        return new PageError('UNKNOWN_PROPERTY', { property: params.additionalProperty })
      } else if (keyword === 'type') {
        if (instancePath === '/name') return new PageError('NAME_STRING_TYPE_REQUIRED')
      }
      throw new Error('Unknown AJV error: ' + JSON.stringify(error, null, 2))
    })
  }
}
