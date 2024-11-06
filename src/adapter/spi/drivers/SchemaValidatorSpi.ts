import type { JSONSchema, Spi } from '@domain/services/SchemaValidator'
import type { SchemaErrorDto } from '../dtos/ErrorDto'
import { ErrorMapper } from '../mappers/ErrorMapper'

export interface Driver {
  validateFromFile(json: unknown, schemaFileName: string): SchemaErrorDto[]
  validate(json: unknown, schema: JSONSchema): SchemaErrorDto[]
}

export class SchemaValidatorSpi implements Spi {
  constructor(private _driver: Driver) {}

  validateFromFile = (json: unknown, schemaFileName: string) => {
    const errors = this._driver.validateFromFile(json, schemaFileName)
    return ErrorMapper.toManySchemaEntities(errors)
  }

  validate = (json: unknown, schema: JSONSchema) => {
    const errors = this._driver.validate(json, schema)
    return ErrorMapper.toManySchemaEntities(errors)
  }
}
