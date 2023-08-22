import { JSONSchemaType } from 'ajv'

export interface BaseActionDto {
  name: string
}

export const BaseActionDtoSchema: JSONSchemaType<BaseActionDto> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
  },
  required: ['name'],
}
