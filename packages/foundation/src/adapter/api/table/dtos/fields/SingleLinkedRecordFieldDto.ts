import { JSONSchemaType } from 'ajv'
import { BaseFieldDto, BaseFieldDtoSchema } from './BaseFieldDto'

export interface SingleLinkedRecordFieldDto extends BaseFieldDto {
  type: 'single_linked_record'
  table: string
}

export const SingleLinkedRecordDtoSchema: JSONSchemaType<SingleLinkedRecordFieldDto> = {
  type: 'object',
  properties: {
    ...BaseFieldDtoSchema.properties,
    type: { type: 'string', enum: ['single_linked_record'] },
    table: { type: 'string' },
  },
  required: [...BaseFieldDtoSchema.required, 'type', 'table'],
  additionalProperties: false,
}
