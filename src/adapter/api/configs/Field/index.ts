import type { IDateTimeField } from './DateTime'
import type { IEmailField } from './Email'
import type { IFormulaField } from './Formula'
import type { ILongTextField } from './LongText'
import type { IMultipleLinkedRecordField } from './MultipleLinkedRecord'
import type { INumberField } from './Number'
import type { IRollupField } from './Rollup'
import type { ISingleLineTextField } from './SingleLineText'
import type { ISingleLinkedRecordField } from './SingleLinkedRecord'
import type { ISingleSelectField } from './SingleSelect'

export type IField =
  | IDateTimeField
  | IEmailField
  | IFormulaField
  | ILongTextField
  | IMultipleLinkedRecordField
  | INumberField
  | IRollupField
  | ISingleLineTextField
  | ISingleLinkedRecordField
  | ISingleSelectField
