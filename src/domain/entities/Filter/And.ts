import type { JSONSchema } from '@domain/services/SchemaValidator'
import { filterSchema, type Filter, type FilterConfig } from '.'

export type AndFilterConfig = {
  and: FilterConfig[]
}

export const andFilterSchema: JSONSchema = {
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

export class AndFilter {
  constructor(public filters: Filter[]) {}

  toConfig(): AndFilterConfig {
    return { and: this.filters.map((filter) => filter.toConfig()) }
  }
}
