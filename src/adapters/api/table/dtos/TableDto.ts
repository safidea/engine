import { JSONSchemaType } from 'ajv'
import { FieldDto, FieldDtoSchema } from './FieldDto'

export interface TableDto {
  name: string
  fields: FieldDto[]
}

export const TableDtoSchema: JSONSchemaType<TableDto> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    fields: {
      type: 'array',
      items: FieldDtoSchema,
    },
  },
  required: ['name', 'fields'],
  additionalProperties: false,
}
