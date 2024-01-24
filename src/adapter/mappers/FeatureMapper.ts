import type { ISchemaValidatorError } from '@domain/drivers/ISchemaValidator'
import { FeatureError } from '@domain/entities/feature/FeatureError'
import type { IMapper } from './IMapper'
import { Mapper } from './Mapper'
import { SpecMapper } from './SpecMapper'
import { PageMapper } from './PageMapper'

export class FeatureMapper extends Mapper implements IMapper {
  private specMapper = new SpecMapper()
  private pageMapper = new PageMapper()

  schemaValidatorToEngineError = (error: ISchemaValidatorError) => {
    const { instancePath, keyword, params } = error
    const firstPath = this.getFirstPath(instancePath)
    if (firstPath === 'specs') {
      return this.specMapper.schemaValidatorToEngineError(this.getMapperError(error))
    } else if (firstPath === 'pages') {
      return this.pageMapper.schemaValidatorToEngineError(this.getMapperError(error))
    } else {
      if (keyword === 'required') {
        if (params.missingProperty === 'name') return new FeatureError('NAME_REQUIRED')
      } else if (keyword === 'additionalProperties') {
        return new FeatureError('UNKNOWN_PROPERTY', { property: params.additionalProperty })
      } else if (keyword === 'type') {
        if (instancePath === '/name') return new FeatureError('NAME_STRING_TYPE_REQUIRED')
      }
    }
  }

  schemaValidatorToEngineErrors = (errors: ISchemaValidatorError[]) => {
    return this.mapSchemaValidatorToEngineErrors(errors, this.schemaValidatorToEngineError)
  }
}
