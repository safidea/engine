import type { JSONSchema } from '@domain/services/SchemaValidator'
import { filterSchema, type Filter, type FilterDto } from '.'

export type OrFilterConfig = {
  or: FilterDto[]
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

  toDto(): OrFilterConfig {
    return { or: this.filters.map((filter) => filter.toDto()) }
  }
}
