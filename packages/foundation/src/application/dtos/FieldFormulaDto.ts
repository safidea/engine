import { FieldDto } from './FieldDto'

export interface FieldFormulaDto extends FieldDto {
  type: 'formula'
  formula: string
  format?: 'currency'
}
