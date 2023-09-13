import { BaseFieldOptions } from '../base/BaseFieldOptions'

export interface FormulaFieldOptions extends BaseFieldOptions {
  type: 'formula'
  formula: string
}
