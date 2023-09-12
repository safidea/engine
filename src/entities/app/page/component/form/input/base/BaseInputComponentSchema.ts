import { JSONSchemaType } from 'ajv'
import { BaseInputComponentOptions } from './BaseInputComponentOptions'

export const BaseInputComponentSchema: JSONSchemaType<BaseInputComponentOptions> = {
  type: 'object',
  properties: {
    type: { type: 'string' },
    field: { type: 'string' },
    label: { type: 'string', nullable: true },
  },
  required: ['field'],
  additionalProperties: false,
}
