import { AppDrivers } from '@entities/app/App'
import { FieldParams } from './FieldParams'
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

export function newField(params: FieldParams, drivers: AppDrivers): Field {
  switch (params.type) {
    case 'currency':
      return new CurrencyField(params, drivers)
    case 'formula':
      return new FormulaField(params, drivers)
    case 'long_text':
      return new LongTextField(params, drivers)
    case 'multiple_linked_records':
      return new MultipleLinkedRecordsField(params, drivers)
    case 'number':
      return new NumberField(params, drivers)
    case 'rollup':
      return new RollupField(params, drivers)
    case 'single_line_text':
      return new SingleLineTextField(params, drivers)
    case 'single_linked_record':
      return new SingleLinkedRecordField(params, drivers)
    case 'datetime':
      return new DatetimeField(params, drivers)
    case 'single_select':
      return new SingleSelectField(params, drivers)
    case 'autonumber':
      return new AutonumberField(params, drivers)
    case 'url':
      return new UrlField(params, drivers)
  }
}
