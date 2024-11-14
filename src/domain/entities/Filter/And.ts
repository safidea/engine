import type { JSONSchema } from '@domain/services/SchemaValidator'
import { filterSchema, type Filter, type FilterConfig } from '.'

export type AndConfig = {
  and: FilterConfig[]
}

export const andSchema: JSONSchema = {
  type: 'object',
  properties: {
    and: {
      type: 'array',
      items: filterSchema,
    },
  },
  required: ['and'],
  additionalProperties: false,
}

export class And {
  constructor(public filters: Filter[]) {}

  toConfig(): AndConfig {
    return { and: this.filters.map((filter) => filter.toConfig()) }
  }
}
