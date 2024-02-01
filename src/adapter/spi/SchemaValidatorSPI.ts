import type { SchemaValidatorNameDto } from './dtos/SchemaValidatorNameDto'
import type { SchemaValidatorSPI as ISchemaValidatorSPI } from '@domain/services/SchemaValidator'
import type { SchemaValidatorErrorDto } from './dtos/SchemaValidatorErrorDto'

export interface SchemaValidatorDriver {
  validateSchema<T>(
    json: unknown,
    name: SchemaValidatorNameDto
  ): {
    json?: T
    errors: SchemaValidatorErrorDto[]
  }
}

export class SchemaValidatorSPI implements ISchemaValidatorSPI {
  constructor(private driver: SchemaValidatorDriver) {}

  validateSchema = <T>(data: unknown, schema: SchemaValidatorNameDto) => {
    return this.driver.validateSchema<T>(data, schema)
  }
}
