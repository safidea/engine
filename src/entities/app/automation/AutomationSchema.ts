import { JSONSchemaType } from 'ajv'
import { AutomationOptions } from './AutomationOptions'
import { ActionSchema } from './action/ActionSchema'
import { TriggerSchema } from './trigger/TriggerSchema'

export const AutomationSchema: JSONSchemaType<AutomationOptions> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    trigger: TriggerSchema,
    actions: {
      type: 'array',
      items: ActionSchema,
    },
  },
  required: ['name', 'actions'],
  additionalProperties: false,
}
