import type { EngineError, EngineErrorCode } from '@domain/entities/EngineError'

export type SchemaName = 'app' | 'component' | 'feature' | 'page' | 'role' | 'spec' | 'table'

export interface Params {
  error: (code: EngineErrorCode) => EngineError
}

export interface Spi {
  params: Params
  validateSchema<T>(
    json: unknown,
    name: SchemaName
  ): {
    json?: T
    errors: EngineError[]
  }
}

export class SchemaValidator {
  constructor(public spi: Spi) {}

  validate<T>(schema: unknown, name: SchemaName) {
    const { params, validateSchema } = this.spi
    const { json, errors } = validateSchema<T>(schema, name)
    if (errors.length > 0) return { errors, json: undefined }
    if (!json) return { errors: [params.error('UNKNOWN_SCHEMA_ERROR')], json: undefined }
    return { errors: undefined, json }
  }
}
