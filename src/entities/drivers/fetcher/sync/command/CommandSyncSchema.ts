import { JSONSchemaType } from 'ajv'
import { CommandSync } from './CommandSync'

export const CommandSyncSchema: JSONSchemaType<CommandSync> = {
  type: 'object',
  required: ['type', 'table', 'record'],
  properties: {
    type: { type: 'string', enum: ['create', 'update', 'delete'] },
    table: { type: 'string' },
    record: RecordSchema,
  },
}
