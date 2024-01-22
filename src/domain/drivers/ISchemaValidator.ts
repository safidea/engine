export type ISchemaValidatorSchema = 'app' | 'component' | 'feature' | 'page' | 'role' | 'spec'

export interface ISchemaValidator {
  validateSchema<T>(
    json: unknown,
    schema: ISchemaValidatorSchema
  ): {
    json?: T
    errors?: {
      instancePath: string
      keyword: string
      params: {
        missingProperty: string
        additionalProperty: string
      }
    }[]
  }
}
