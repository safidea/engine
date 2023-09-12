import { JSONSchemaType } from 'ajv'
import { FindRecordActionOptions } from './FindRecordActionOptions'

export const FindRecordActionSchema: JSONSchemaType<FindRecordActionOptions> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    type: { type: 'string', enum: ['find_record'] },
    table: { type: 'string' },
    recordId: { type: 'string' },
  },
  required: ['name', 'type', 'table'],
}
