import { AppDrivers } from '@entities/app/App'
import { FieldOptions } from './FieldOptions'
import { AutonumberField } from './autonumber/AutonumberField'
import { CurrencyField } from './currency/CurrencyField'
import { DatetimeField } from './datetime/DatetimeField'
import { FormulaField } from './formula/FormulaField'
import { LongTextField } from './longText/LongTextField'
import { MultipleLinkedRecordsField } from './multipleLinkedRecords/MultipleLinkedRecordsField'
import { NumberField } from './number/NumberField'
import { RollupField } from './rollup/RollupField'
import { SingleLineTextField } from './singleLineText/SingleLineTextField'
import { SingleLinkedRecordField } from './singleLinkedRecord/SingleLinkedRecordField'
import { SingleSelectField } from './singleSelectField/SingleSelectField'
import { UrlField } from './url/UrlField'

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

export function newField(options: FieldOptions, drivers: AppDrivers): Field {
  switch (options.type) {
    case 'currency':
      return new CurrencyField(options, drivers)
    case 'formula':
      return new FormulaField(options, drivers)
    case 'long_text':
      return new LongTextField(options, drivers)
    case 'multiple_linked_records':
      return new MultipleLinkedRecordsField(options, drivers)
    case 'number':
      return new NumberField(options, drivers)
    case 'rollup':
      return new RollupField(options, drivers)
    case 'single_line_text':
      return new SingleLineTextField(options, drivers)
    case 'single_linked_record':
      return new SingleLinkedRecordField(options, drivers)
    case 'datetime':
      return new DatetimeField(options, drivers)
    case 'single_select':
      return new SingleSelectField(options, drivers)
    case 'autonumber':
      return new AutonumberField(options, drivers)
    case 'url':
      return new UrlField(options, drivers)
  }
}
