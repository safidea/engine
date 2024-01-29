import type { ISchemaValidatorError } from '@domain/drivers/ISchemaValidator'
import { TableError } from '@domain/entities/table/TableError'
import type { IMapper } from './IMapper'
import { Mapper } from './Mapper'

export class TableMapper extends Mapper implements IMapper {
  schemaValidatorToEngineError = (error: ISchemaValidatorError) => {
    const { instancePath, keyword, params } = error
    if (keyword === 'required') {
      if (params.missingProperty === 'name') return new TableError('NAME_REQUIRED')
      if (params.missingProperty === 'fields') return new TableError('FIELDS_REQUIRED')
    } else if (keyword === 'additionalProperties') {
      return new TableError('UNKNOWN_PROPERTY', { property: params.additionalProperty })
    } else if (keyword === 'type') {
      if (instancePath === '/name') return new TableError('NAME_STRING_TYPE_REQUIRED')
    }
  }

  schemaValidatorToEngineErrors = (errors: ISchemaValidatorError[]) => {
    return this.mapSchemaValidatorToEngineErrors(errors, this.schemaValidatorToEngineError)
  }
}
