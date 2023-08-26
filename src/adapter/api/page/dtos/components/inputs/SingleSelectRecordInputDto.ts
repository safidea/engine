import { JSONSchemaType } from 'ajv'
import { BaseInputDto, BaseInputDtoSchema } from './BaseInputDto'

export interface SingleSelectRecordInputDto extends BaseInputDto {
  placeholder?: string
  linkedLabelField?: string
}

export const SingleSelectRecordInputDtoSchema: JSONSchemaType<SingleSelectRecordInputDto> = {
  type: 'object',
  properties: {
    ...BaseInputDtoSchema.properties,
    placeholder: { type: 'string', nullable: true },
    linkedLabelField: { type: 'string', nullable: true },
  },
  required: [...BaseInputDtoSchema.required],
  additionalProperties: false,
}
