import { JSONSchemaType } from 'ajv'

export interface RecordCreatedTriggerDto {
  event: 'record_created'
  table: string
}

export const RecordCreatedTriggerDtoSchema: JSONSchemaType<RecordCreatedTriggerDto> = {
  type: 'object',
  properties: {
    event: { type: 'string', enum: ['record_created'] },
    table: { type: 'string' },
  },
  required: ['event', 'table'],
  additionalProperties: false,
}
