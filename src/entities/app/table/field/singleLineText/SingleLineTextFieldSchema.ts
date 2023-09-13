import { JSONSchemaType } from 'ajv'
import { BaseFieldSchema } from '../base/BaseFieldSchema'
import { SingleLineTextFieldOptions } from './SingleLineTextFieldOptions'

export const SingleLineTextFieldSchema: JSONSchemaType<SingleLineTextFieldOptions> = {
  type: 'object',
  properties: {
    ...BaseFieldSchema.properties,
    type: { type: 'string', enum: ['single_line_text'] },
  },
  required: [...BaseFieldSchema.required, 'type'],
  additionalProperties: false,
}
