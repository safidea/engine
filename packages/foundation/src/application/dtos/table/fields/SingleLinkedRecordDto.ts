import { JSONSchemaType } from '@application/utils/SchemaValidator'
import { BaseFieldDto, BaseFieldDtoSchema } from './BaseFieldDto'

export interface SingleLinkedRecordDto extends BaseFieldDto {
  type: 'single_linked_record'
  table: string
}

export const SingleLinkedRecordDtoSchema: JSONSchemaType<SingleLinkedRecordDto> = {
  type: 'object',
  properties: {
    ...BaseFieldDtoSchema.properties,
    type: { type: 'string', enum: ['single_linked_record'] },
    table: { type: 'string' },
  },
  required: [...BaseFieldDtoSchema.required, 'type', 'table'],
  additionalProperties: false,
}
