import { JSONSchemaType } from 'ajv'

export interface ServerStartedTriggerDto {
  event: 'server_started'
}

export const ServerStartedTriggerDtoSchema: JSONSchemaType<ServerStartedTriggerDto> = {
  type: 'object',
  properties: {
    event: { type: 'string', enum: ['server_started'] },
  },
  required: ['event'],
  additionalProperties: false,
}
