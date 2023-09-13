import { JSONSchemaType } from 'ajv'
import { FormulaFieldOptions } from './FormulaFieldOptions'
import { BaseFieldSchema } from '../base/BaseFieldSchema'

export const FormulaFieldSchema: JSONSchemaType<FormulaFieldOptions> = {
  type: 'object',
  properties: {
    ...BaseFieldSchema.properties,
    type: { type: 'string', enum: ['formula'] },
    formula: { type: 'string' },
  },
  required: [...BaseFieldSchema.required, 'type', 'formula'],
  additionalProperties: false,
}
