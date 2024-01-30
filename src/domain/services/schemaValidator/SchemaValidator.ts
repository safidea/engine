import type { ISchemaValidatorMapper } from '../../mappers/ISchemaValidatorMapper'

export class SchemaValidator {
  constructor(public mapper: ISchemaValidatorMapper) {}

  validate<T>(schema: unknown) {
    return this.mapper.validateSchema<T>(schema)
  }
}
