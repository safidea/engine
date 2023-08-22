import { JSONSchemaType } from 'ajv'
import { BaseFieldDto, BaseFieldDtoSchema } from './BaseFieldDto'

export interface SingleLineTextFieldDto extends BaseFieldDto {
  type: 'single_line_text'
}

export const SingleLineTextDtoSchema: JSONSchemaType<SingleLineTextFieldDto> = {
  type: 'object',
  properties: {
    ...BaseFieldDtoSchema.properties,
    type: { type: 'string', enum: ['single_line_text'] },
  },
  required: [...BaseFieldDtoSchema.required, 'type'],
  additionalProperties: false,
}
