import { JSONSchemaType } from '@adapter/api/utils/AjvUtils'
import { FilterDto, FilterDtoSchema } from '../FilterDto'

export interface SyncResourceDto {
  table: string
  filters?: FilterDto[]
}

export const SyncResourceDtoSchema: JSONSchemaType<SyncResourceDto> = {
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
