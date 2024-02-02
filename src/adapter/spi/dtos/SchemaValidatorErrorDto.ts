import type { SchemaName } from "@domain/services/SchemaValidator"

export type SchemaValidatorErrorDto = {
  schema: SchemaName
  instancePath: string
  keyword: string
  params: {
    missingProperty: string
    additionalProperty: string
  }
  index?: number
}
