import { JSONSchemaType } from 'ajv'
import { TextInputComponentOptions } from './TextInputComponentOptions'
import { BaseInputComponentSchema } from '../base/BaseInputComponentSchema'

export const TextInputComponentSchema: JSONSchemaType<TextInputComponentOptions> = {
  type: 'object',
  properties: {
    ...BaseInputComponentSchema.properties,
    placeholder: { type: 'string', nullable: true },
  },
  required: [...BaseInputComponentSchema.required],
  additionalProperties: false,
}
