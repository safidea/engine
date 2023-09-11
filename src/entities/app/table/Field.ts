import { AutonumberField } from './fields/AutonumberField'
import { CurrencyField } from './fields/CurrencyField'
import { DatetimeField } from './fields/DatetimeField'
import { FormulaField } from './fields/FormulaField'
import { LongTextField } from './fields/LongTextField'
import { MultipleLinkedRecordsField } from './fields/MultipleLinkedRecordsField'
import { NumberField } from './fields/NumberField'
import { RollupField } from './fields/RollupField'
import { SingleLineTextField } from './fields/SingleLineTextField'
import { SingleLinkedRecordField } from './fields/SingleLinkedRecordField'
import { SingleSelectField } from './fields/SingleSelectField'
import { UrlField } from './fields/UrlField'

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
