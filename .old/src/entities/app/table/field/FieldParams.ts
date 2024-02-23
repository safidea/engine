import * as t from 'io-ts'
import { AutonumberFieldParams } from './autonumber/AutonumberFieldParams'
import { CurrencyFieldParams } from './currency/CurrencyFieldParams'
import { DatetimeFieldParams } from './datetime/DatetimeFieldParams'
import { FormulaFieldParams } from './formula/FormulaFieldParams'
import { LongTextFieldParams } from './longText/LongTextFieldParams'
import { MultipleLinkedRecordsFieldParams } from './multipleLinkedRecords/MultipleLinkedRecordsFieldParams'
import { NumberFieldParams } from './number/NumberFieldParams'
import { RollupFieldParams } from './rollup/RollupFieldParams'
import { SingleLineTextFieldParams } from './singleLineText/SingleLineTextFieldParams'
import { SingleLinkedRecordFieldParams } from './singleLinkedRecord/SingleLinkedRecordFieldParams'
import { SingleSelectFieldParams } from './singleSelectField/SingleSelectFieldParams'
import { UrlFieldParams } from './url/UrlFieldParams'

export type FieldParams =
  | AutonumberFieldParams
  | CurrencyFieldParams
  | DatetimeFieldParams
  | FormulaFieldParams
  | LongTextFieldParams
  | MultipleLinkedRecordsFieldParams
  | NumberFieldParams
  | RollupFieldParams
  | SingleLineTextFieldParams
  | SingleLinkedRecordFieldParams
  | SingleSelectFieldParams
  | UrlFieldParams

export const FieldParams: t.Type<FieldParams> = t.union([
  SingleLineTextFieldParams,
  LongTextFieldParams,
  CurrencyFieldParams,
  NumberFieldParams,
  FormulaFieldParams,
  SingleLinkedRecordFieldParams,
  MultipleLinkedRecordsFieldParams,
  RollupFieldParams,
  DatetimeFieldParams,
  SingleSelectFieldParams,
  AutonumberFieldParams,
  UrlFieldParams,
])
