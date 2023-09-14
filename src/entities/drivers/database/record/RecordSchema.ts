import { JSONSchemaType } from 'ajv'
import { RecordData } from './RecordData'

export const RecordSchema: JSONSchemaType<RecordData> = {
  type: 'object',
  additionalProperties: true,
  properties: {
    id: { type: 'string', nullable: true },
    created_time: { type: 'string', nullable: true },
    last_modified_time: { type: 'string', nullable: true },
    deleted_time: { type: 'string', nullable: true },
  },
}
