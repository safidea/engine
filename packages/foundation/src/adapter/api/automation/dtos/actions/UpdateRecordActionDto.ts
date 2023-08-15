import { JSONSchemaType } from 'ajv'

export interface UpdateRecordActionDto {
  type: 'update_record'
  table: string
  fields: Record<string, string>
}

export const UpdateRecordActionDtoSchema: JSONSchemaType<UpdateRecordActionDto> = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['update_record'] },
    table: { type: 'string' },
    fields: {
      type: 'object',
      additionalProperties: { type: 'string' },
      required: [],
    },
  },
  required: ['type', 'table', 'fields'],
}
