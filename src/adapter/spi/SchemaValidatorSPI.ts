import type {
  SchemaValidatorSpi as ISchemaValidatorSpi,
  SchemaName,
} from '@domain/services/SchemaValidator'
import type { SchemaValidatorErrorDto } from './dtos/SchemaValidatorErrorDto'
import { EngineMapper } from '../api/mappers/EngineMapper'

export interface SchemaValidatorDriver {
  validateSchema<T>(
    json: unknown,
    name: SchemaName
  ): {
    json?: T
    errors: SchemaValidatorErrorDto[]
  }
}

export class SchemaValidatorSpi implements ISchemaValidatorSpi {
  constructor(private driver: SchemaValidatorDriver) {}

  validateSchema = <T>(schema: unknown, name: SchemaName) => {
    const { json, errors } = this.driver.validateSchema<T>(schema, name)
    return {
      json,
      errors: EngineMapper.toErrorEntities(errors),
    }
  }
}
