import { TableServices } from '@entities/app/table/TableServices'

import { BaseField } from '../base/BaseField'
import { FormulaFieldParams } from './FormulaFieldParams'

export class FormulaField extends BaseField {
  readonly formula: string

  constructor(params: FormulaFieldParams, services: TableServices) {
    const { formula, ...rest } = params
    super(rest, services)
    this.formula = formula
  }
}
