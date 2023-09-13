import { AutonumberFieldOptions } from './autonumber/AutonumberFieldOptions'
import { CurrencyFieldOptions } from './currency/CurrencyFieldOptions'
import { DatetimeFieldOptions } from './datetime/DatetimeFieldOptions'
import { FormulaFieldOptions } from './formula/FormulaFieldOptions'
import { LongTextFieldOptions } from './longText/LongTextFieldOptions'
import { MultipleLinkedRecordsFieldOptions } from './multipleLinkedRecords/MultipleLinkedRecordsFieldOptions'
import { NumberFieldOptions } from './number/NumberFieldOptions'
import { RollupFieldOptions } from './rollup/RollupFieldOptions'
import { SingleLineTextFieldOptions } from './singleLineText/SingleLineTextFieldOptions'
import { SingleLinkedRecordFieldOptions } from './singleLinkedRecord/SingleLinkedRecordFieldOptions'
import { SingleSelectFieldOptions } from './singleSelectField/SingleSelectFieldOptions'
import { UrlFieldOptions } from './url/UrlFieldOptions'

export type FieldOptions =
  | SingleLineTextFieldOptions
  | LongTextFieldOptions
  | CurrencyFieldOptions
  | NumberFieldOptions
  | FormulaFieldOptions
  | SingleLinkedRecordFieldOptions
  | MultipleLinkedRecordsFieldOptions
  | RollupFieldOptions
  | DatetimeFieldOptions
  | SingleSelectFieldOptions
  | AutonumberFieldOptions
  | UrlFieldOptions
