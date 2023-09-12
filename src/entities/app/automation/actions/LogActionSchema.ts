import { JSONSchemaType } from 'ajv'
import { LogActionOptions } from './LogActionOptions'

export const LogActionSchema: JSONSchemaType<LogActionOptions> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    type: { type: 'string', enum: ['log'] },
    message: { type: 'string' },
  },
  required: ['name', 'type', 'message'],
}
