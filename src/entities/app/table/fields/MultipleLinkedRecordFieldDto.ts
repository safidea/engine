import { JSONSchemaType } from 'ajv'
import { BaseFieldDto, BaseFieldDtoSchema } from './BaseFieldDto'

export interface MultipleLinkedRecordFieldDto extends BaseFieldDto {
  type: 'multiple_linked_records'
  table: string
}

export const MultipleLinkedRecordDtoSchema: JSONSchemaType<MultipleLinkedRecordFieldDto> = {
  type: 'object',
  properties: {
    ...BaseFieldDtoSchema.properties,
    type: { type: 'string', enum: ['multiple_linked_records'] },
    table: { type: 'string' },
  },
  required: [...BaseFieldDtoSchema.required, 'type', 'table'],
  additionalProperties: false,
}
