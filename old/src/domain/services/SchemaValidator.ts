import type { SchemaError } from '@domain/entities/error/Schema'

export interface Spi {
  validateSchema(json: unknown, name: string): SchemaError[]
}

export class SchemaValidator {
  constructor(public spi: Spi) {}

  validate = (schema: unknown, name: string) => {
    return this.spi.validateSchema(schema, name)
  }
}
