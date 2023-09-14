import { JSONSchemaType } from 'ajv'
import { IsFilterOptions } from './IsFilterOptions'

export const IsFilterSchema: JSONSchemaType<IsFilterOptions> = {
  type: 'object',
  properties: {
    field: { type: 'string' },
    operator: { type: 'string', enum: ['is'] },
    value: { type: 'string' },
  },
  required: ['field', 'operator', 'value'],
  additionalProperties: false,
}
