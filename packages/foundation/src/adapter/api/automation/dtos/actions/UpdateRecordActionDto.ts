import { JSONSchemaType } from 'ajv'
import { BaseActionDto, BaseActionDtoSchema } from './BaseActionDto'

export interface UpdateRecordActionDto extends BaseActionDto {
  type: 'update_record'
  table: string
  recordId: string
  fields: Record<string, string>
}

export const UpdateRecordActionDtoSchema: JSONSchemaType<UpdateRecordActionDto> = {
  type: 'object',
  properties: {
    ...BaseActionDtoSchema.properties,
    type: { type: 'string', enum: ['update_record'] },
    table: { type: 'string' },
    recordId: { type: 'string' },
    fields: {
      type: 'object',
      additionalProperties: { type: 'string' },
      required: [],
    },
  },
  required: [...BaseActionDtoSchema.required, 'type', 'table', 'fields'],
}
