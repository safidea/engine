import { JSONSchemaType } from 'ajv'
import { BaseFieldDto, BaseFieldDtoSchema } from './BaseFieldDto'

export interface AutonumberDto extends BaseFieldDto {
  type: 'autonumber'
}

export const AutonumberDtoSchema: JSONSchemaType<AutonumberDto> = {
  type: 'object',
  properties: {
    ...BaseFieldDtoSchema.properties,
    type: { type: 'string', enum: ['autonumber'] },
  },
  required: [...BaseFieldDtoSchema.required, 'type'],
  additionalProperties: false,
}
