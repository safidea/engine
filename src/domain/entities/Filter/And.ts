import type { JSONSchema } from '@domain/services/SchemaValidator'
import { type Filter, type FilterDto } from '.'

export type AndFilterConfig = {
  and: FilterDto[]
}

export const andFilterSchema: JSONSchema = {
  type: 'object',
  properties: {},
  required: ['and'],
  additionalProperties: false,
}

export class AndFilter {
  constructor(public filters: Filter[]) {}

  toDto(): AndFilterConfig {
    return { and: this.filters.map((filter) => filter.toDto()) }
  }
}
