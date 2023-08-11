import { JSONSchemaType } from 'ajv'
import { BaseFieldDto, BaseFieldDtoSchema } from './BaseFieldDto'

export interface SingleLineTextDto extends BaseFieldDto {
  type: 'single_line_text'
}

export const SingleLineTextDtoSchema: JSONSchemaType<SingleLineTextDto> = {
  type: 'object',
  properties: {
    ...BaseFieldDtoSchema.properties,
    type: { type: 'string', enum: ['single_line_text'] },
  },
  required: [...BaseFieldDtoSchema.required, 'type'],
  additionalProperties: false,
}
