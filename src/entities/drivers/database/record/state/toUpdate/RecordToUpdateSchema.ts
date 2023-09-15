import { JSONSchemaType } from 'ajv'
import { RecordToUpdateData } from './RecordToUpdateData'

export const RecordToUpdateSchema: JSONSchemaType<RecordToUpdateData> = {
  type: 'object',
  additionalProperties: true,
  properties: {
    id: { type: 'string', nullable: true },
    last_modified_time: {
      type: 'string',
      format: 'date-time',
      nullable: true,
    },
  },
  required: ['id', 'last_modified_time'],
}
