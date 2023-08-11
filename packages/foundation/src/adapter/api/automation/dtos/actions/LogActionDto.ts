import { JSONSchemaType } from 'ajv'

export interface LogActionDto {
  type: 'log'
  message: string
}

export const LogActionDtoSchema: JSONSchemaType<LogActionDto> = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['log'] },
    message: { type: 'string' },
  },
  required: ['type', 'message'],
}
