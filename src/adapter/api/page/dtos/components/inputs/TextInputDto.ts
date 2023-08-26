import { JSONSchemaType } from 'ajv'
import { BaseInputDto, BaseInputDtoSchema } from './BaseInputDto'

export interface TextInputDto extends BaseInputDto {
  placeholder?: string
}

export const TextDtoSchema: JSONSchemaType<TextInputDto> = {
  type: 'object',
  properties: {
    ...BaseInputDtoSchema.properties,
    placeholder: { type: 'string', nullable: true },
  },
  required: [...BaseInputDtoSchema.required],
  additionalProperties: false,
}
