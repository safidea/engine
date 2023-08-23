import { JSONSchemaType } from 'ajv'
import { BaseActionDto, BaseActionDtoSchema } from './BaseActionDto'

export interface FindRecordActionDto extends BaseActionDto {
  type: 'find_record'
  table: string
  recordId: string
}

export const FindRecordActionDtoSchema: JSONSchemaType<FindRecordActionDto> = {
  type: 'object',
  properties: {
    ...BaseActionDtoSchema.properties,
    type: { type: 'string', enum: ['find_record'] },
    table: { type: 'string' },
    recordId: { type: 'string' },
  },
  required: [...BaseActionDtoSchema.required, 'type', 'table'],
}
