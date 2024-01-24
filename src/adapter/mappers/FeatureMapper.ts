import type { ISchemaValidatorError } from '@domain/drivers/ISchemaValidator'
import { FeatureError } from '@domain/entities/feature/FeatureError'
import type { IMapper } from './IMapper'

export class FeatureMapper implements IMapper {
  schemaValidatorToEngineErrors(errors: ISchemaValidatorError[]) {
    return errors.map((error) => {
      const { instancePath, keyword, params } = error
      if (keyword === 'required') {
        if (params.missingProperty === 'name') return new FeatureError('NAME_REQUIRED')
        if (params.missingProperty === 'story') return new FeatureError('STORY_REQUIRED')
        if (params.missingProperty === 'specs') return new FeatureError('SPECS_REQUIRED')
      } else if (keyword === 'additionalProperties') {
        return new FeatureError('UNKNOWN_PROPERTY', { property: params.additionalProperty })
      } else if (keyword === 'type') {
        if (instancePath === '/name') return new FeatureError('NAME_STRING_TYPE_REQUIRED')
      }
      throw new Error('Unknown AJV error: ' + JSON.stringify(error, null, 2))
    })
  }
}
