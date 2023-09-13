import { JSONSchemaType } from 'ajv'
import { BaseFieldSchema } from '../base/BaseFieldSchema'
import { SingleLinkedRecordFieldOptions } from './SingleLinkedRecordFieldOptions'

export const SingleLinkedRecordFieldSchema: JSONSchemaType<SingleLinkedRecordFieldOptions> = {
  type: 'object',
  properties: {
    ...BaseFieldSchema.properties,
    type: { type: 'string', enum: ['single_linked_record'] },
    table: { type: 'string' },
  },
  required: [...BaseFieldSchema.required, 'type', 'table'],
  additionalProperties: false,
}
