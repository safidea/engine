import { JSONSchemaType } from 'ajv'
import { IsAnyOfFilterOptions } from './IsAnyOfFilterOptions'

export const IsAnyOfFilterSchema: JSONSchemaType<IsAnyOfFilterOptions> = {
  type: 'object',
  properties: {
    field: { type: 'string' },
    operator: { type: 'string', enum: ['is_any_of'] },
    value: { type: 'array', items: { type: 'string' } },
  },
  required: ['field', 'operator', 'value'],
  additionalProperties: false,
}
