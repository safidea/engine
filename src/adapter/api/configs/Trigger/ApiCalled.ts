import type { JSONSchema } from '@domain/services/SchemaValidator'
import type { OutputParser } from '@domain/services/Template'

export interface ApiCalled {
  trigger: 'ApiCalled'
  path: string
  input?: Required<Pick<JSONSchema, 'properties'>>['properties']
  output: {
    [key: string]: {
      value: string
      type: OutputParser
    }
  }
}
