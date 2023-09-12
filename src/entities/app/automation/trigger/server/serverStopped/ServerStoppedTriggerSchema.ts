import { JSONSchemaType } from 'ajv'
import { ServerStoppedTriggerOptions } from './ServerStoppedTriggerOptions'

export const ServerStoppedTriggerSchema: JSONSchemaType<ServerStoppedTriggerOptions> = {
  type: 'object',
  properties: {
    event: { type: 'string', enum: ['server_stopped'] },
  },
  required: ['event'],
  additionalProperties: false,
}
