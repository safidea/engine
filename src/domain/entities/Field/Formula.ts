import { BaseField, type BaseFieldParams } from './base'
import type { DateTimeField } from './DateTime'
import type { LongTextField } from './LongText'
import type { NumberField } from './Number'
import type { SingleLineTextField } from './SingleLineText'

interface FormulaFieldParams extends BaseFieldParams {
  formula: string
  output: NumberField | LongTextField | SingleLineTextField | DateTimeField
}

export class FormulaField extends BaseField {
  formula: string
  output: NumberField | LongTextField | SingleLineTextField | DateTimeField

  constructor(params: FormulaFieldParams) {
    super(params)
    this.formula = params.formula
    this.output = params.output
  }
}
