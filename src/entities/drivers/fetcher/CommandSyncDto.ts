import { JSONSchemaType } from 'ajv'
import { RecordDto, RecordDtoSchema } from '@adapters/spi/orm/dtos/RecordDto'

export interface CommandSyncDto {
  type: 'create' | 'update' | 'delete'
  table: string
  record: RecordDto
}

export const CommandSyncDtoSchema: JSONSchemaType<CommandSyncDto> = {
  type: 'object',
  required: ['type', 'table', 'record'],
  properties: {
    type: { type: 'string', enum: ['create', 'update', 'delete'] },
    table: { type: 'string' },
    record: RecordDtoSchema,
  },
}
