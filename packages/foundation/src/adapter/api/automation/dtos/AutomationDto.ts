import { JSONSchemaType } from '@adapter/api/utils/AjvUtils'

export interface ActionUpdateTableDto {
  type: 'updateTable'
  table: string
  fields: Record<string, string>
}

export interface ActionLogDto {
  type: 'log'
  message: string
}

export type ActionDto = ActionUpdateTableDto | ActionLogDto

// TODO: use snake case on all event names
export interface TriggerRecordCreatedDto {
  event: 'recordCreated'
  table: string
}

export interface TriggerOnStartupDto {
  event: 'on_startup'
}

export type TriggerDto = TriggerRecordCreatedDto | TriggerOnStartupDto

export type AutomationDto = {
  name: string
  trigger: TriggerDto
  actions: ActionDto[]
}

export const AutomationDtoSchema: JSONSchemaType<AutomationDto> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    trigger: {
      type: 'object',
      oneOf: [
        {
          type: 'object',
          properties: {
            event: { type: 'string', enum: ['on_startup'] },
          },
          required: ['event'],
          additionalProperties: false,
        },
        {
          type: 'object',
          properties: {
            event: { type: 'string', enum: ['recordCreated'] },
            table: { type: 'string' },
          },
          required: ['event', 'table'],
          additionalProperties: false,
        },
      ],
    },
    actions: {
      type: 'array',
      items: {
        type: 'object',
        oneOf: [
          {
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
          },
          {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['log'] },
              message: { type: 'string' },
            },
            required: ['type', 'message'],
          },
        ],
      },
    },
  },
  required: ['name', 'actions'],
  additionalProperties: false,
}
