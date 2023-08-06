import { JSONSchemaType } from '@adapter/api/utils/AjvUtils'
import { BaseFieldDto, BaseFieldDtoSchema } from './BaseFieldDto'

export interface FormulaDto extends BaseFieldDto {
  type: 'formula'
  formula: string
}

export const FormulaDtoSchema: JSONSchemaType<FormulaDto> = {
  type: 'object',
  properties: {
    ...BaseFieldDtoSchema.properties,
    type: { type: 'string', enum: ['formula'] },
    formula: { type: 'string' },
  },
  required: [...BaseFieldDtoSchema.required, 'type', 'formula'],
  additionalProperties: false,
}
