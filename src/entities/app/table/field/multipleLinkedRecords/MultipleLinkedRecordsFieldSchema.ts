import { JSONSchemaType } from 'ajv'
import { BaseFieldSchema } from '../base/BaseFieldSchema'
import { MultipleLinkedRecordsFieldOptions } from './MultipleLinkedRecordsFieldOptions'

export const MultipleLinkedRecordsFieldSchema: JSONSchemaType<MultipleLinkedRecordsFieldOptions> = {
  type: 'object',
  properties: {
    ...BaseFieldSchema.properties,
    type: { type: 'string', enum: ['multiple_linked_records'] },
    table: { type: 'string' },
  },
  required: [...BaseFieldSchema.required, 'type', 'table'],
  additionalProperties: false,
}
