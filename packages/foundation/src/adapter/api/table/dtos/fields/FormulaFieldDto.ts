import { JSONSchemaType } from 'ajv'
import { BaseFieldDto, BaseFieldDtoSchema } from './BaseFieldDto'

export interface FormulaFieldDto extends BaseFieldDto {
  type: 'formula'
  formula: string
}

export const FormulaFieldDtoSchema: JSONSchemaType<FormulaFieldDto> = {
  type: 'object',
  properties: {
    ...BaseFieldDtoSchema.properties,
    type: { type: 'string', enum: ['formula'] },
    formula: { type: 'string' },
  },
  required: [...BaseFieldDtoSchema.required, 'type', 'formula'],
  additionalProperties: false,
}
