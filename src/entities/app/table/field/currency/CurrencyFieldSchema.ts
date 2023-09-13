import { JSONSchemaType } from 'ajv'
import { BaseFieldSchema } from '../base/BaseFieldSchema'
import { CurrencyFieldOptions } from './CurrencyFieldOptions'

export const CurrencyFieldSchema: JSONSchemaType<CurrencyFieldOptions> = {
  type: 'object',
  properties: {
    ...BaseFieldSchema.properties,
    type: { type: 'string', enum: ['currency'] },
  },
  required: [...BaseFieldSchema.required, 'type'],
  additionalProperties: false,
}
