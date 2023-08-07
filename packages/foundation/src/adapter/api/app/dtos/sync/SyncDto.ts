import { JSONSchemaType } from '@adapter/api/utils/AjvUtils'
import { SyncCommandDto, SyncCommandDtoSchema } from './SyncCommandDto'
import { SyncResourceDto, SyncResourceDtoSchema } from './SyncResourceDto'

export interface SyncDto {
  commands?: SyncCommandDto[]
  resources?: SyncResourceDto[]
}

export const SyncDtoSchema: JSONSchemaType<SyncDto> = {
  type: 'object',
  properties: {
    commands: {
      type: 'array',
      items: SyncCommandDtoSchema,
      nullable: true,
    },
    resources: {
      type: 'array',
      items: SyncResourceDtoSchema,
      nullable: true,
    },
  },
}
