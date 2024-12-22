import type { IBaseAction } from './base'
import type { IDateTimeField } from './DateTime'
import type { ILongTextField } from './LongText'
import type { INumberField } from './Number'
import type { ISingleLineTextField } from './SingleLineText'

export interface IFormulaField extends IBaseAction {
  field: 'Formula'
  formula: string
  output: Omit<ISingleLineTextField | ILongTextField | INumberField | IDateTimeField, 'name'>
}
