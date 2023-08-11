import { JSONSchemaType } from 'ajv'
import { FilterDto, FilterDtoSchema } from '../FilterDto'

export interface ResourceSyncDto {
  table: string
  filters?: FilterDto[]
}

export const ResourceSyncDtoSchema: JSONSchemaType<ResourceSyncDto> = {
  type: 'object',
  required: ['table'],
  properties: {
    table: { type: 'string' },
    filters: {
      type: 'array',
      items: FilterDtoSchema,
      nullable: true,
    },
  },
}
