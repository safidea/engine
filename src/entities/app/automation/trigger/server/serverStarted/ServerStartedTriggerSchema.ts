import { JSONSchemaType } from 'ajv'
import { ServerStartedTriggerOptions } from './ServerStartedTriggerOptions'

export const ServerStartedTriggerSchema: JSONSchemaType<ServerStartedTriggerOptions> = {
  type: 'object',
  properties: {
    event: { type: 'string', enum: ['server_started'] },
  },
  required: ['event'],
  additionalProperties: false,
}
