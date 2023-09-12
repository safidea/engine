import { JSONSchemaType } from 'ajv'
import { SingleSelectInputComponentOptions } from './SingleSelectInputComponentOptions'
import { BaseInputComponentSchema } from '../base/BaseInputComponentSchema'

export const SingleSelectInputSchema: JSONSchemaType<SingleSelectInputComponentOptions> = {
  type: 'object',
  properties: {
    ...BaseInputComponentSchema.properties,
    placeholder: { type: 'string', nullable: true },
    options: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          value: { type: 'string' },
          label: { type: 'string' },
        },
      },
    },
  },
  required: [...BaseInputComponentSchema.required],
  additionalProperties: false,
}
