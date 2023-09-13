import { JSONSchemaType } from 'ajv'
import { BaseFieldSchema } from '../base/BaseFieldSchema'
import { DatetimeFieldOptions } from './DatetimeFieldOptions'

export const DatetimeFieldSchema: JSONSchemaType<DatetimeFieldOptions> = {
  type: 'object',
  properties: {
    ...BaseFieldSchema.properties,
    type: { type: 'string', enum: ['datetime'] },
  },
  required: [...BaseFieldSchema.required, 'type'],
  additionalProperties: false,
}
