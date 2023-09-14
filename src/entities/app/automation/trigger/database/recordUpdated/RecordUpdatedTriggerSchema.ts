import { JSONSchemaType } from 'ajv'
import { RecordUpdatedTriggerOptions } from './RecordUpdatedTriggerOptions'
import { FilterSchema } from '@entities/drivers/database/filter/FilterSchema'

export const RecordUpdatedTriggerSchema: JSONSchemaType<RecordUpdatedTriggerOptions> = {
  type: 'object',
  properties: {
    event: { type: 'string', enum: ['record_updated'] },
    table: { type: 'string' },
    fields: {
      type: 'array',
      items: { type: 'string' },
      nullable: true,
    },
    filters: {
      type: 'array',
      items: FilterSchema,
      nullable: true,
    },
  },
  required: ['event', 'table'],
  additionalProperties: false,
}
