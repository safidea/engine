export type SchemaValidatorName =
  | 'app'
  | 'component'
  | 'feature'
  | 'page'
  | 'role'
  | 'spec'
  | 'table'

export interface SchemaValidatorError {
  instancePath: string
  keyword: string
  params: {
    missingProperty: string
    additionalProperty: string
  }
  index?: number
}

export interface SchemaValidatorSpi {
  validateSchema<T>(
    json: unknown,
    name: SchemaValidatorName
  ): {
    json?: T
    errors: SchemaValidatorError[]
  }
}

export class SchemaValidator {
  constructor(public spi: SchemaValidatorSpi) {}

  validate<T>(json: unknown, schema: SchemaValidatorName) {
    return this.spi.validateSchema<T>(json, schema)
  }
}
