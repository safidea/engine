import type { Spi } from '@domain/services/SchemaValidator'
import type { SchemaErrorDto } from './dtos/ErrorDto'
import { ErrorMapper } from './mappers/ErrorMapper'

export interface Driver {
  validateSchema(json: unknown, name: string): SchemaErrorDto[]
}

export class SchemaValidatorSpi implements Spi {
  constructor(private driver: Driver) {}

  validateSchema = (schema: unknown, name: string) => {
    const errors = this.driver.validateSchema(schema, name)
    return ErrorMapper.toManySchemaEntities(errors)
  }
}
