import { JSONSchemaType } from '@adapter/api/utils/AjvUtils'
import { BaseFieldDto, BaseFieldDtoSchema } from './BaseFieldDto'

export interface MultipleLinkedRecordDto extends BaseFieldDto {
  type: 'multiple_linked_records'
  table: string
}

export const MultipleLinkedRecordDtoSchema: JSONSchemaType<MultipleLinkedRecordDto> = {
  type: 'object',
  properties: {
    ...BaseFieldDtoSchema.properties,
    type: { type: 'string', enum: ['multiple_linked_records'] },
    table: { type: 'string' },
  },
  required: [...BaseFieldDtoSchema.required, 'type', 'table'],
  additionalProperties: false,
}
