import { JSONSchemaType } from '@application/utils/SchemaValidator'

export type AutomationDto = {
  name: string
  actions: {
    type: 'updateTable'
    table: string
    fields: Record<string, string>
  }[]
}

export const AutomationDtoSchema: JSONSchemaType<AutomationDto> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    actions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['updateTable'] },
          table: { type: 'string' },
          fields: {
            type: 'object',
            additionalProperties: { type: 'string' },
            required: [],
          },
        },
        required: ['type', 'table', 'fields'],
        additionalProperties: false,
      },
    },
  },
  required: ['name', 'actions'],
  additionalProperties: false,
}
