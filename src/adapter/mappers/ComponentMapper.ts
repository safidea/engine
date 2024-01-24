import type { ISchemaValidatorError } from '@domain/drivers/ISchemaValidator'
import { ComponentError } from '@domain/entities/component/ComponentError'
import type { IMapper } from './IMapper'

export class ComponentMapper implements IMapper {
  schemaValidatorToEngineErrors(errors: ISchemaValidatorError[]) {
    return errors
      .filter(({ keyword, instancePath }) => {
        // TODO: add a better management for these keywords
        console.log(keyword, instancePath)
        if (keyword === 'anyOf') return false
        if (keyword === 'const') return false
        if (keyword === 'type') {
          console.log(/\/components\/\d+\/template/.test(instancePath))
          if (/\/components\/\d+\/template/.test(instancePath)) return false
        }
        return true
      })
      .map((error) => {
        const { instancePath, keyword, params } = error
        if (keyword === 'required') {
          if (params.missingProperty === 'name') return new ComponentError('NAME_REQUIRED')
          if (params.missingProperty === 'template') return new ComponentError('TEMPLATE_REQUIRED')
        } else if (keyword === 'additionalProperties') {
          return new ComponentError('UNKNOWN_PROPERTY', { property: params.additionalProperty })
        } else if (keyword === 'type') {
          if (instancePath === '/name') return new ComponentError('NAME_STRING_TYPE_REQUIRED')
        }
        throw new Error('Unknown AJV error: ' + JSON.stringify(error, null, 2))
      })
  }
}
