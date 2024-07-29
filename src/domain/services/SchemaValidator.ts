import type { SchemaError } from '@domain/entities/Error/Schema'

export interface JSONSchema {
  type: string
  properties: {
    [key: string]: {
      type: string
      enum?: string[]
    }
  }
  required: string[]
}

export interface Spi {
  validateFromFile(json: unknown, schemaFileName: string): SchemaError[]
  validate(json: unknown, schema: JSONSchema): SchemaError[]
}

export class SchemaValidator {
  constructor(public spi: Spi) {}

  validateFromFile = (json: unknown, schemaFileName: string) => {
    return this.spi.validateFromFile(json, schemaFileName)
  }

  validate = (json: unknown, schema: JSONSchema) => {
    return this.spi.validate(json, schema)
  }
}
