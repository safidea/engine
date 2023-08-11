import { JSONSchemaType } from 'ajv'

export interface ServerStoppedTriggerDto {
  event: 'server_stopped'
}

export const ServerStoppedTriggerDtoSchema: JSONSchemaType<ServerStoppedTriggerDto> = {
  type: 'object',
  properties: {
    event: { type: 'string', enum: ['server_stopped'] },
  },
  required: ['event'],
  additionalProperties: false,
}
