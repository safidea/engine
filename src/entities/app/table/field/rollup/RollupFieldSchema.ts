import { JSONSchemaType } from 'ajv'
import { RollupFieldOptions } from './RollupFieldOptions'
import { BaseFieldSchema } from '../base/BaseFieldSchema'

export const RollupFieldSchema: JSONSchemaType<RollupFieldOptions> = {
  type: 'object',
  properties: {
    ...BaseFieldSchema.properties,
    type: { type: 'string', enum: ['rollup'] },
    linkedRecords: { type: 'string' },
    linkedField: { type: 'string' },
    formula: { type: 'string' },
  },
  required: [...BaseFieldSchema.required, 'type', 'linkedRecords', 'linkedField', 'formula'],
  additionalProperties: false,
}
