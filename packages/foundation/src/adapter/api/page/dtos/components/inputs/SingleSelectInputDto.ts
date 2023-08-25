import { JSONSchemaType } from 'ajv'
import { BaseInputDto, BaseInputDtoSchema } from './BaseInputDto'

export interface SingleSelectInputDto extends BaseInputDto {
  placeholder?: string
  options: { value: string; label: string }[]
}

export const SingleSelectInputDtoSchema: JSONSchemaType<SingleSelectInputDto> = {
  type: 'object',
  properties: {
    ...BaseInputDtoSchema.properties,
    placeholder: { type: 'string', nullable: true },
    options: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          value: { type: 'string' },
          label: { type: 'string' },
        },
      },
    },
  },
  required: [...BaseInputDtoSchema.required],
  additionalProperties: false,
}
