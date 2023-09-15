import { JSONSchemaType } from 'ajv'
import { BaseRecordFields } from './BaseRecordData'

export const BaseRecordSchema: JSONSchemaType<BaseRecordFields> = {
  type: 'object',
  additionalProperties: true,
  properties: {
    id: { type: 'string', nullable: true },
    created_time: { type: 'string', format: 'date-time', nullable: true },
    last_modified_time: {
      type: 'string',
      format: 'date-time',
      nullable: true,
    },
    deleted_time: {
      type: 'string',
      format: 'date-time',
      nullable: true,
    },
  },
}
