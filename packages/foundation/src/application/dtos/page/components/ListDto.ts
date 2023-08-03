import { JSONSchemaType } from '@application/utils/SchemaValidator'

export interface ListDto {
  type: 'list'
  table: string
  groupBy?: {
    field: string
    order: 'asc' | 'desc' | 'first_to_last' | 'last_to_first'
  }[]
  sortBy?: {
    field: string
    order: 'asc' | 'desc' | 'first_to_last' | 'last_to_first'
  }[]
  columns: {
    label: string
    field?: string
    options?: {
      name: string
      label: string
    }[]
    type?: string
    action?: {
      type: string
      path?: string
    }
  }[]
}

export const ListDtoSchema: JSONSchemaType<ListDto> = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['list'] },
    table: { type: 'string' },
    groupBy: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          field: { type: 'string' },
          order: { type: 'string', enum: ['asc', 'desc', 'first_to_last', 'last_to_first'] },
        },
        required: ['field', 'order'],
        additionalProperties: false,
      },
      nullable: true,
    },
    sortBy: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          field: { type: 'string' },
          order: { type: 'string', enum: ['asc', 'desc', 'first_to_last', 'last_to_first'] },
        },
        required: ['field', 'order'],
        additionalProperties: false,
      },
      nullable: true,
    },
    columns: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          field: { type: 'string', nullable: true },
          options: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                label: { type: 'string' },
              },
              required: ['name', 'label'],
              additionalProperties: false,
            },
            nullable: true,
          },
          type: { type: 'string', nullable: true },
          action: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              path: { type: 'string', nullable: true },
            },
            required: ['type'],
            additionalProperties: false,
            nullable: true,
          },
        },
        required: ['label'],
        additionalProperties: false,
      },
    },
  },
  required: ['type', 'table', 'columns'],
  additionalProperties: false,
}
