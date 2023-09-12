import { JSONSchemaType } from 'ajv'
import { FilterOptions } from './FilterOptions'

export const FilterSchema: JSONSchemaType<FilterOptions> = {
  type: 'object',
  properties: {
    field: { type: 'string' },
    operator: { type: 'string', enum: ['is_any_of', 'is'] },
    value: {
      oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    },
  },
  required: ['field', 'operator', 'value'],
  additionalProperties: false,
}
