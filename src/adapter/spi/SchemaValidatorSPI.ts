import type { Spi, SchemaName, Params } from '@domain/services/SchemaValidator'
import type { SchemaValidatorErrorDto } from './dtos/SchemaValidatorErrorDto'
import { EngineMapper } from '../api/mappers/EngineMapper'

export interface Driver {
  params: Params
  validateSchema<T>(
    json: unknown,
    name: SchemaName
  ): {
    json?: T
    errors: SchemaValidatorErrorDto[]
  }
}

export class SchemaValidatorSpi implements Spi {
  constructor(private driver: Driver) {}

  get params() {
    return this.driver.params
  }

  validateSchema = <T>(schema: unknown, name: SchemaName) => {
    const { json, errors } = this.driver.validateSchema<T>(schema, name)
    return {
      json,
      errors: EngineMapper.toManyErrorEntities(errors),
    }
  }
}
