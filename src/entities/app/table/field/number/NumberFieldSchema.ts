import { JSONSchemaType } from 'ajv'
import { BaseFieldSchema } from '../base/BaseFieldSchema'
import { NumberFieldOptions } from './NumberFieldOptions'

export const NumberFieldSchema: JSONSchemaType<NumberFieldOptions> = {
  type: 'object',
  properties: {
    ...BaseFieldSchema.properties,
    type: { type: 'string', enum: ['number'] },
  },
  required: [...BaseFieldSchema.required, 'type'],
  additionalProperties: false,
}
