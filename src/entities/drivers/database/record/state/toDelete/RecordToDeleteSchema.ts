import { JSONSchemaType } from 'ajv'
import { RecordToDeleteData } from './RecordToDeleteData'

export const RecordToDeleteSchema: JSONSchemaType<RecordToDeleteData> = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    deleted_time: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['id', 'deleted_time'],
}
