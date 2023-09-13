import { JSONSchemaType } from 'ajv'
import { BaseFieldSchema } from '../base/BaseFieldSchema'
import { SingleSelectFieldOptions } from './SingleSelectFieldOptions'

export const SingleSelectFieldSchema: JSONSchemaType<SingleSelectFieldOptions> = {
  type: 'object',
  properties: {
    ...BaseFieldSchema.properties,
    type: { type: 'string', enum: ['single_select'] },
    options: { type: 'array', items: { type: 'string' } },
  },
  required: [...BaseFieldSchema.required, 'type', 'options'],
  additionalProperties: false,
}
