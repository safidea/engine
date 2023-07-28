import { JSONSchemaType } from '@application/utils/SchemaValidator'
import { BaseFieldDto, BaseFieldDtoSchema } from './BaseFieldDto'

export interface DatetimeDto extends BaseFieldDto {
  type: 'datetime'
}

export const DatetimeDtoSchema: JSONSchemaType<DatetimeDto> = {
  type: 'object',
  properties: {
    ...BaseFieldDtoSchema.properties,
    type: { type: 'string', enum: ['datetime'] },
  },
  required: [...BaseFieldDtoSchema.required, 'type'],
  additionalProperties: false,
}
