import { AppServices } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { FormulaFieldParams } from './FormulaFieldParams'

export class FormulaField extends BaseField {
  readonly formula: string

  constructor(params: FormulaFieldParams, services: AppServices) {
    const { formula, ...rest } = params
    super(rest, services)
    this.formula = formula
  }
}
