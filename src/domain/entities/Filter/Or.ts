import type { JSONSchema } from '@domain/services/SchemaValidator'
import { filterSchema, type Filter, type FilterConfig } from '.'

export type OrConfig = {
  or: FilterConfig[]
}

export const orSchema: JSONSchema = {
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

export class Or {
  constructor(public filters: Filter[]) {}

  toConfig(): OrConfig {
    return { or: this.filters.map((filter) => filter.toConfig()) }
  }
}
