import { JSONSchemaType } from 'ajv'
import { LongTextFieldOptions } from './LongTextFieldOptions'
import { BaseFieldSchema } from '../base/BaseFieldSchema'

export const LongTextFieldSchema: JSONSchemaType<LongTextFieldOptions> = {
  type: 'object',
  properties: {
    ...BaseFieldSchema.properties,
    type: { type: 'string', enum: ['long_text'] },
  },
  required: [...BaseFieldSchema.required, 'type'],
  additionalProperties: false,
}
