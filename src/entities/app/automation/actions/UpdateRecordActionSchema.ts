import { JSONSchemaType } from 'ajv'
import { UpdateRecordActionOptions } from './UpdateRecordActionOptions'

export const UpdateRecordActionSchema: JSONSchemaType<UpdateRecordActionOptions> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    type: { type: 'string', enum: ['update_record'] },
    table: { type: 'string' },
    recordId: { type: 'string' },
    fields: {
      type: 'object',
      additionalProperties: { type: 'string' },
      required: [],
    },
  },
  required: ['name', 'type', 'table', 'fields'],
}
