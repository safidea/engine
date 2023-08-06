import { JSONSchemaType } from '@adapter/api/app/AppUtils'

export interface FilterDto {
  field: string
  operator: 'is_any_of'
  value: string | number | boolean | string[] | number[] | boolean[]
}

export const FilterDtoSchema: JSONSchemaType<FilterDto> = {
  type: 'object',
  properties: {
    field: { type: 'string' },
    operator: { type: 'string', enum: ['is_any_of'] },
    value: {
      oneOf: [
        { type: 'string' },
        { type: 'number' },
        { type: 'boolean' },
        { type: 'array', items: { type: 'string' } },
        { type: 'array', items: { type: 'number' } },
        { type: 'array', items: { type: 'boolean' } },
      ],
    },
  },
  required: ['field', 'operator', 'value'],
  additionalProperties: false,
}
