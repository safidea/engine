import { AppDrivers } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { FormulaFieldParams } from './FormulaFieldParams'

export class FormulaField extends BaseField {
  readonly formula: string

  constructor(params: FormulaFieldParams, drivers: AppDrivers) {
    const { formula, ...rest } = params
    super(rest, drivers)
    this.formula = formula
  }
}
