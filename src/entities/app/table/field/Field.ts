import { AutonumberField } from './field/autonumber/AutonumberField'
import { CurrencyField } from './field/CurrencyField'
import { DatetimeField } from './field/datetime/DatetimeField'
import { FormulaField } from './field/formula/FormulaField'
import { LongTextField } from './field/longText/LongTextField'
import { MultipleLinkedRecordsField } from './field/MultipleLinkedRecordsField'
import { NumberField } from './field/NumberField'
import { RollupField } from './field/RollupField'
import { SingleLineTextField } from './field/singleLineText/SingleLineTextField'
import { SingleLinkedRecordField } from './field/singleLinkedRecord/SingleLinkedRecordField'
import { SingleSelectField } from './field/singleSelectField/SingleSelectField'
import { UrlField } from './field/url/UrlField'

export type Field =
  | CurrencyField
  | FormulaField
  | LongTextField
  | MultipleLinkedRecordsField
  | NumberField
  | RollupField
  | SingleLineTextField
  | SingleLinkedRecordField
  | DatetimeField
  | SingleSelectField
  | AutonumberField
  | UrlField
