import { AppDrivers } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { FormulaFieldOptions } from './FormulaFieldOptions'

export class FormulaField extends BaseField {
  readonly formula: string

  constructor(options: FormulaFieldOptions, drivers: AppDrivers) {
    const { formula, ...rest } = options
    super(rest, drivers)
    this.formula = formula
  }
}
