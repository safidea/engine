import { JSONSchemaType } from 'ajv'

export interface RecordUpdatedTriggerDto {
  event: 'record_updated'
  table: string
}

export const RecordUpdatedTriggerDtoSchema: JSONSchemaType<RecordUpdatedTriggerDto> = {
  type: 'object',
  properties: {
    event: { type: 'string', enum: ['record_updated'] },
    table: { type: 'string' },
  },
  required: ['event', 'table'],
  additionalProperties: false,
}
