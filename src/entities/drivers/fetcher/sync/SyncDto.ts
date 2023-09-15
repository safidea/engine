import { JSONSchemaType } from 'ajv'
import { CommandSyncDto, CommandSyncDtoSchema } from './command/CommandSync'
import { ResourceSyncDto, ResourceSyncDtoSchema } from './resource/ResourceSyncDto'

export interface SyncDto {
  commands?: CommandSyncDto[]
  resources?: ResourceSyncDto[]
}

export const SyncDtoSchema: JSONSchemaType<SyncDto> = {
  type: 'object',
  properties: {
    commands: {
      type: 'array',
      items: CommandSyncDtoSchema,
      nullable: true,
    },
    resources: {
      type: 'array',
      items: ResourceSyncDtoSchema,
      nullable: true,
    },
  },
}
