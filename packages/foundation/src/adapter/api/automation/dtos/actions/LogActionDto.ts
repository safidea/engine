import { JSONSchemaType } from 'ajv'
import { BaseActionDto, BaseActionDtoSchema } from './BaseActionDto'

export interface LogActionDto extends BaseActionDto {
  type: 'log'
  message: string
}

export const LogActionDtoSchema: JSONSchemaType<LogActionDto> = {
  type: 'object',
  properties: {
    ...BaseActionDtoSchema.properties,
    type: { type: 'string', enum: ['log'] },
    message: { type: 'string' },
  },
  required: [...BaseActionDtoSchema.required, 'type', 'message'],
}
