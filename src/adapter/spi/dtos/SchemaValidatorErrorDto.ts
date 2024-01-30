export interface SchemaValidatorErrorDto {
  instancePath: string
  keyword: string
  params: {
    missingProperty: string
    additionalProperty: string
  }
  index?: number
}
