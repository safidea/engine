import { FilterDto, FilterDtoSchema } from '@adapter/spi/orm/dtos/FilterDto'
import { JSONSchemaType } from 'ajv'

export interface RecordUpdatedTriggerDto {
  event: 'record_updated'
  table: string
  fields?: string[]
  filters?: FilterDto[]
}

export const RecordUpdatedTriggerDtoSchema: JSONSchemaType<RecordUpdatedTriggerDto> = {
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
      items: FilterDtoSchema,
      nullable: true,
    },
  },
  required: ['event', 'table'],
  additionalProperties: false,
}
