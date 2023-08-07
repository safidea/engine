import { JSONSchemaType } from '@adapter/api/utils/AjvUtils'
import { RecordDto, RecordDtoSchema } from '../RecordDto'

export interface SyncCommandDto {
  type: 'create' | 'update' | 'delete'
  table: string
  record: RecordDto
}

export const SyncCommandDtoSchema: JSONSchemaType<SyncCommandDto> = {
  type: 'object',
  required: ['type', 'table', 'record'],
  properties: {
    type: { type: 'string', enum: ['create', 'update', 'delete'] },
    table: { type: 'string' },
    record: RecordDtoSchema,
  },
}
