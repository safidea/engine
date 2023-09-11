import { FilterDto, FilterDtoSchema } from '@adapters/spi/orm/dtos/FilterDto'
import { JSONSchemaType } from 'ajv'

export interface RecordCreatedTriggerDto {
  event: 'record_created'
  table: string
  filters?: FilterDto[]
}

export const RecordCreatedTriggerDtoSchema: JSONSchemaType<RecordCreatedTriggerDto> = {
  type: 'object',
  properties: {
    event: { type: 'string', enum: ['record_created'] },
    table: { type: 'string' },
    filters: {
      type: 'array',
      items: FilterDtoSchema,
      nullable: true,
    },
  },
  required: ['event', 'table'],
  additionalProperties: false,
}
