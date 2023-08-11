import { JSONSchemaType } from 'ajv'
import { BaseFieldDto, BaseFieldDtoSchema } from './BaseFieldDto'

export interface CurrencyDto extends BaseFieldDto {
  type: 'currency'
}

export const CurrencyDtoSchema: JSONSchemaType<CurrencyDto> = {
  type: 'object',
  properties: {
    ...BaseFieldDtoSchema.properties,
    type: { type: 'string', enum: ['currency'] },
  },
  required: [...BaseFieldDtoSchema.required, 'type'],
  additionalProperties: false,
}
