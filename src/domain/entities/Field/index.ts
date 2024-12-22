import type { DateTimeField } from './DateTime'
import type { EmailField } from './Email'
import type { LongTextField } from './LongText'
import type { SingleLineTextField } from './SingleLineText'
import type { NumberField } from './Number'
import type { FormulaField } from './Formula'
import type { SingleSelectField } from './SingleSelect'
import type { SingleLinkedRecordField } from './SingleLinkedRecord'
import type { MultipleLinkedRecordField } from './MultipleLinkedRecord'
import type { RollupField } from './Rollup'
import type { CheckboxField } from './Checkbox'

export type Field =
  | EmailField
  | SingleLineTextField
  | LongTextField
  | DateTimeField
  | NumberField
  | FormulaField
  | SingleSelectField
  | SingleLinkedRecordField
  | MultipleLinkedRecordField
  | RollupField
  | CheckboxField
