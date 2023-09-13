import { JSONSchemaType } from 'ajv'
import { UrlFieldOptions } from './UrlFieldOptions'
import { BaseFieldSchema } from '../base/BaseFieldSchema'

export const UrlFieldSchema: JSONSchemaType<UrlFieldOptions> = {
  type: 'object',
  properties: {
    ...BaseFieldSchema.properties,
    type: { type: 'string', enum: ['url'] },
  },
  required: [...BaseFieldSchema.required, 'type'],
  additionalProperties: false,
}
