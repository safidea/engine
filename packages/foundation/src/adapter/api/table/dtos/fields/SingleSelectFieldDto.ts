import { JSONSchemaType } from 'ajv'
import { BaseFieldDto, BaseFieldDtoSchema } from './BaseFieldDto'

export interface SingleSelectFieldDto extends BaseFieldDto {
  type: 'single_select'
  options: string[]
}

export const SingleSelectDtoSchema: JSONSchemaType<SingleSelectFieldDto> = {
  type: 'object',
  properties: {
    ...BaseFieldDtoSchema.properties,
    type: { type: 'string', enum: ['single_select'] },
    options: { type: 'array', items: { type: 'string' } },
  },
  required: [...BaseFieldDtoSchema.required, 'type', 'options'],
  additionalProperties: false,
}
