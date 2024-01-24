import type { ISchemaValidatorError } from '@domain/drivers/ISchemaValidator'
import { AppError } from '@domain/entities/app/AppError'
import type { IMapper } from './IMapper'
import { FeatureMapper } from './FeatureMapper'
import { RoleMapper } from './RoleMapper'
import { Mapper } from './Mapper'

export class AppMapper extends Mapper implements IMapper {
  private roleMapper = new RoleMapper()
  private featureMapper = new FeatureMapper()

  schemaValidatorToEngineError = (error: ISchemaValidatorError) => {
    const { instancePath, keyword, params } = error
    const firstPath = this.getFirstPath(instancePath)
    if (firstPath === 'roles') {
      if (keyword === 'type') return new AppError('ROLES_ARRAY_TYPE_REQUIRED')
      return this.roleMapper.schemaValidatorToEngineError(this.getMapperError(error))
    } else if (firstPath === 'features') {
      if (keyword === 'type') return new AppError('FEATURES_ARRAY_TYPE_REQUIRED')
      return this.featureMapper.schemaValidatorToEngineError(this.getMapperError(error))
    } else {
      if (keyword === 'required') {
        if (params.missingProperty === 'name') return new AppError('NAME_REQUIRED')
        if (params.missingProperty === 'features') return new AppError('FEATURES_REQUIRED')
      } else if (keyword === 'additionalProperties') {
        return new AppError('UNKNOWN_PROPERTY', { property: params.additionalProperty })
      } else if (keyword === 'type') {
        if (instancePath === '/name') return new AppError('NAME_STRING_TYPE_REQUIRED')
        if (instancePath === '/translations')
          return new AppError('TRANSLATIONS_ARRAY_TYPE_REQUIRED')
      }
    }
  }

  schemaValidatorToEngineErrors = (errors: ISchemaValidatorError[]) => {
    return this.mapSchemaValidatorToEngineErrors(errors, this.schemaValidatorToEngineError)
  }
}
