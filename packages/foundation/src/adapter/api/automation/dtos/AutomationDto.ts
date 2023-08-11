import { JSONSchemaType } from 'ajv'
import { TriggerDto, TriggerDtoSchema } from './TriggerDto'
import { ActionDto, ActionDtoSchema } from './ActionDto'

export interface AutomationDto {
  name: string
  trigger: TriggerDto
  actions: ActionDto[]
}

export const AutomationDtoSchema: JSONSchemaType<AutomationDto> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    trigger: TriggerDtoSchema,
    actions: {
      type: 'array',
      items: ActionDtoSchema,
    },
  },
  required: ['name', 'actions'],
  additionalProperties: false,
}
