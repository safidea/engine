import { JSONSchemaType } from 'ajv'
import { BaseFieldSchema } from '../base/BaseFieldSchema'
import { AutonumberFieldOptions } from './AutonumberFieldOptions'

export const AutonumberFieldSchema: JSONSchemaType<AutonumberFieldOptions> = {
  type: 'object',
  properties: {
    ...BaseFieldSchema.properties,
    type: { type: 'string', enum: ['autonumber'] },
  },
  required: [...BaseFieldSchema.required, 'type'],
  additionalProperties: false,
}
