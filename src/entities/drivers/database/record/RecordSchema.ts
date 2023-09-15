import { JSONSchemaType } from 'ajv'
import { RecordData } from './state/base/BaseRecordData'

export const RecordSchema: JSONSchemaType<RecordData> = {
  type: 'object',
  properties: {
    id: { type: 'string', nullable: true },
    created_time: { type: 'string', nullable: true },
    last_modified_time: { type: 'string', nullable: true },
    deleted_time: { type: 'string', nullable: true },
  },
  required: ['id', 'created_time'],
  additionalProperties: true,
}
