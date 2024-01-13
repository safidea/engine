import { TableServices } from '@entities/app/table/TableServices'

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

export function newField(params: FieldParams, services: TableServices): Field {
  switch (params.type) {
    case 'currency':
      return new CurrencyField(params, services)
    case 'formula':
      return new FormulaField(params, services)
    case 'long_text':
      return new LongTextField(params, services)
    case 'multiple_linked_records':
      return new MultipleLinkedRecordsField(params, services)
    case 'number':
      return new NumberField(params, services)
    case 'rollup':
      return new RollupField(params, services)
    case 'single_line_text':
      return new SingleLineTextField(params, services)
    case 'single_linked_record':
      return new SingleLinkedRecordField(params, services)
    case 'datetime':
      return new DatetimeField(params, services)
    case 'single_select':
      return new SingleSelectField(params, services)
    case 'autonumber':
      return new AutonumberField(params, services)
    case 'url':
      return new UrlField(params, services)
  }
}
