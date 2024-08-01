import type { JSONSchema } from '@domain/services/SchemaValidator'

export interface ApiCalled {
  trigger: 'ApiCalled'
  path: string
  input: JSONSchema
  output: { [key: string]: string | number | boolean }
}
