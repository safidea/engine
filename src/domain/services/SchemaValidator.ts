import type { SchemaError } from '@domain/entities/error/Schema'

export interface Spi {
  validateSchema<T>(
    json: unknown,
    name: string
  ): {
    json?: T
    errors: SchemaError[]
  }
}

export class SchemaValidator {
  constructor(public spi: Spi) {}

  validate = <T>(schema: unknown, name: string) => {
    const { validateSchema } = this.spi
    const { json, errors } = validateSchema<T>(schema, name)
    if (errors.length > 0) return { errors, json: undefined }
    return { errors: undefined, json }
  }
}
