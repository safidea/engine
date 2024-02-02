import type { EngineError, EngineErrorCode } from '@domain/entities/EngineError'

export type SchemaName = 'app' | 'component' | 'feature' | 'page' | 'role' | 'spec' | 'table'

export interface SchemaValidatorSpi {
  validateSchema<T>(
    json: unknown,
    name: SchemaName
  ): {
    json?: T
    errors: EngineError[]
  }
}

export class SchemaValidator {
  constructor(
    public spi: SchemaValidatorSpi,
    private error: (string: EngineErrorCode) => EngineError
  ) {}

  validate<T>(schema: unknown, name: SchemaName) {
    const { json, errors } = this.spi.validateSchema<T>(schema, name)
    if (errors.length > 0) return { errors, json: undefined }
    if (!json) return { errors: [this.error('UNKNOWN_SCHEMA_ERROR')], json: undefined }
    return { errors: undefined, json }
  }
}
