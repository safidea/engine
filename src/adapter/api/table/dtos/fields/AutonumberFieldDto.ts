import { JSONSchemaType } from 'ajv'
import { BaseFieldDto, BaseFieldDtoSchema } from './BaseFieldDto'

export interface AutonumberFieldDto extends BaseFieldDto {
  type: 'autonumber'
}

export const AutonumberDtoSchema: JSONSchemaType<AutonumberFieldDto> = {
  type: 'object',
  properties: {
    ...BaseFieldDtoSchema.properties,
    type: { type: 'string', enum: ['autonumber'] },
  },
  required: [...BaseFieldDtoSchema.required, 'type'],
  additionalProperties: false,
}
