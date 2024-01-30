import type { SchemaValidatorNameDto } from '../dtos/SchemaValidatorNameDto'
import type { SchemaValidatorErrorDto } from '../dtos/SchemaValidatorErrorDto'

export interface ISchemaValidatorDriver {
  validateSchema<T>(
    json: unknown,
    name: SchemaValidatorNameDto
  ): {
    json?: T
    errors: SchemaValidatorErrorDto[]
  }
}
