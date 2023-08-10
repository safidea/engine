import { JSONSchemaType } from '@adapter/api/utils/AjvUtils'

export type AutomationDto = {
  name: string
  trigger: {
    event: 'recordCreated'
    table: string
  }
  actions: {
    type: 'updateTable' | 'log'
    message?: string
    table?: string
    fields?: Record<string, string>
  }[]
}

export const AutomationDtoSchema: JSONSchemaType<AutomationDto> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    trigger: {
      type: 'object',
      properties: {
        event: { type: 'string', enum: ['recordCreated'] },
        table: { type: 'string' },
      },
      required: ['event', 'table'],
      additionalProperties: false,
    },
    actions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['updateTable', 'log'] },
          table: { type: 'string', nullable: true },
          fields: {
            type: 'object',
            additionalProperties: { type: 'string' },
            required: [],
            nullable: true,
          },
          message: { type: 'string', nullable: true },
        },
        required: ['type'],
        additionalProperties: false,
      },
    },
  },
  required: ['name', 'actions'],
  additionalProperties: false,
}
