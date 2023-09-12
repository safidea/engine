import { JSONSchemaType } from 'ajv'
import { TableInputComponentOptions } from './TableInputComponentOptions'
import { BaseInputComponentSchema } from '../base/BaseInputComponentSchema'

export const TableInputComponentSchema: JSONSchemaType<TableInputComponentOptions> = {
  type: 'object',
  properties: {
    ...BaseInputComponentSchema.properties,
    columns: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          field: { type: 'string' },
          placeholder: { type: 'string' },
        },
        required: ['label'],
        additionalProperties: false,
      },
    },
    addLabel: { type: 'string' },
  },
  required: [...BaseInputComponentSchema.required, 'columns'],
  additionalProperties: false,
}
