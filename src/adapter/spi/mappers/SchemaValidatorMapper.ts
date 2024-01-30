import type { ISchemaValidatorDriver } from '../drivers/ISchemaValidatorDriver'
import type { SchemaValidatorName } from '../dtos/SchemaValidatorNameDto'

export class SchemaValidatorMapper {
  constructor(private driver: ISchemaValidatorDriver) {}

  validateSchema(data: unknown, schema: SchemaValidatorName) {
    return this.driver.validateSchema(data, schema)
  }
}
