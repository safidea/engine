import type { SchemaError } from '@domain/entities/Error/Schema'

type JSONSchemaType = 'string' | 'number' | 'boolean' | 'array' | 'object'

export interface JSONSchema {
  type?: JSONSchemaType
  properties?: {
    [key: string]: JSONSchema
  }
  enum?: string[]
  items?: JSONSchema
  required?: string[]
  additionalProperties?: boolean
  oneOf?: JSONSchema[]
}

export interface ISchemaValidatorSpi {
  validateFromFile(json: unknown, schemaFileName: string): SchemaError[]
  validate(json: unknown, schema: JSONSchema): SchemaError[]
}

export class SchemaValidator {
  constructor(private _spi: ISchemaValidatorSpi) {}

  validateFromFile = (json: unknown, schemaFileName: string) => {
    return this._spi.validateFromFile(json, schemaFileName)
  }

  validate = (json: unknown, schema: JSONSchema) => {
    return this._spi.validate(json, schema)
  }
}
