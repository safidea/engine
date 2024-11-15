import type { JSONSchema } from '@domain/services/SchemaValidator'
import { filterSchema, type Filter, type FilterConfig } from '.'

export type OrFilterConfig = {
  or: FilterConfig[]
}

export const orFilterSchema: JSONSchema = {
  type: 'object',
  properties: {
    or: {
      type: 'array',
      items: filterSchema,
    },
  },
  required: ['or'],
  additionalProperties: false,
}

export class OrFilter {
  constructor(public filters: Filter[]) {}

  toConfig(): OrFilterConfig {
    return { or: this.filters.map((filter) => filter.toConfig()) }
  }
}
