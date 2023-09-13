import { JSONSchemaType } from 'ajv'
import { TableOptions } from './TableOptions'
import { FieldSchema } from './field/FieldSchema'

export const TableSchema: JSONSchemaType<TableOptions> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    fields: {
      type: 'array',
      items: FieldSchema,
    },
  },
  required: ['name', 'fields'],
  additionalProperties: false,
}
