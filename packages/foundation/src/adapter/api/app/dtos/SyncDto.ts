import { JSONSchemaType } from "@adapter/api/utils/AjvUtils"
import { RecordDto, RecordDtoSchema } from "./RecordDto"

export interface SyncCommandDto {
  type: 'create' | 'update' | 'delete'
  table: string
  record: RecordDto
}

export interface SyncDto {
  commands: SyncCommandDto[]
}

export const SyncDtoSchema: JSONSchemaType<SyncDto> = {
  type: 'object',
  required: ['commands'],
  properties: {
    commands: {
      type: 'array',
      items: {
        type: 'object',
        required: ['type', 'table', 'record'],
        properties: {
          type: { type: 'string', enum: ['create', 'update', 'delete'] },
          table: { type: 'string' },
          record: RecordDtoSchema,
        },
      },
    },
  },
}

