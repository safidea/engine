import { JSONSchemaType } from 'ajv'

export interface FilterDto {
  field: string
  operator: 'is_any_of' | 'is'
  value: string | string[]
}

export const FilterDtoSchema: JSONSchemaType<FilterDto> = {
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
