import { JSONSchemaType } from 'ajv'
import { RecordCreatedTriggerOptions } from './RecordCreatedTriggerOptions'
import { FilterSchema } from '@entities/drivers/database/FilterSchema'

export const RecordCreatedTriggerSchema: JSONSchemaType<RecordCreatedTriggerOptions> = {
  type: 'object',
  properties: {
    event: { type: 'string', enum: ['record_created'] },
    table: { type: 'string' },
    filters: {
      type: 'array',
      items: FilterSchema,
      nullable: true,
    },
  },
  required: ['event', 'table'],
  additionalProperties: false,
}
