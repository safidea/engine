import { JSONSchemaType } from 'ajv'
import { BaseFieldDto, BaseFieldDtoSchema } from './BaseFieldDto'

export interface LongTextDto extends BaseFieldDto {
  type: 'long_text'
}

export const LongTextDtoSchema: JSONSchemaType<LongTextDto> = {
  type: 'object',
  properties: {
    ...BaseFieldDtoSchema.properties,
    type: { type: 'string', enum: ['long_text'] },
  },
  required: [...BaseFieldDtoSchema.required, 'type'],
  additionalProperties: false,
}
