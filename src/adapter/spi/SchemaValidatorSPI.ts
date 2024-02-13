import type { Spi } from '@domain/services/SchemaValidator'
import type { SchemaErrorDto } from './dtos/ErrorDto'
import { ErrorMapper } from './mappers/ErrorMapper'

export interface Driver {
  validateSchema<T>(
    json: unknown,
    name: string
  ): {
    json?: T
    errors: SchemaErrorDto[]
  }
}

export class SchemaValidatorSpi implements Spi {
  constructor(private driver: Driver) {}

  validateSchema = <T>(schema: unknown, name: string) => {
    const { json, errors } = this.driver.validateSchema<T>(schema, name)
    return {
      json,
      errors: ErrorMapper.toManySchemaEntities(errors),
    }
  }
}
