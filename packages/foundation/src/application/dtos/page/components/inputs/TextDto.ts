import { JSONSchemaType } from '@application/utils/SchemaValidator'
import { BaseInputDto, BaseInputDtoSchema } from './BaseInputDto'

export interface TextDto extends BaseInputDto {
  placeholder?: string
}

export const TextDtoSchema: JSONSchemaType<TextDto> = {
  type: 'object',
  properties: {
    ...BaseInputDtoSchema.properties,
    placeholder: { type: 'string' },
  },
  required: [...BaseInputDtoSchema.required],
  additionalProperties: false,
}
