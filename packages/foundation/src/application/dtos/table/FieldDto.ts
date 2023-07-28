import { Format } from '@domain/entities/table/fields/BaseField'

interface BaseFieldDto {
  name: string
  optional?: boolean
  format?: Format
  default?: string
}

interface SingleLineTextDto extends BaseFieldDto {
  type: 'single_line_text'
}

interface LongTextDto extends BaseFieldDto {
  type: 'long_text'
}

interface NumberDto extends BaseFieldDto {
  type: 'number'
}

interface CurrencyDto extends BaseFieldDto {
  type: 'currency'
}

interface FormulaDto extends BaseFieldDto {
  type: 'formula'
  formula: string
}

interface CreateSingleLinkedRecordDto extends BaseFieldDto {
  type: 'single_linked_record'
  table: string
}

interface MultipleLinkedRecordDto extends BaseFieldDto {
  type: 'multiple_linked_records'
  table: string
}

interface RollupDto extends BaseFieldDto {
  type: 'rollup'
  linked_records: string
  linked_field: string
  formula: string
}

interface DatetimeDto extends BaseFieldDto {
  type: 'datetime'
}

interface SingleSelectDto extends BaseFieldDto {
  type: 'single_select'
  options: string[]
}

export type FieldDto =
  | SingleLineTextDto
  | LongTextDto
  | CurrencyDto
  | NumberDto
  | FormulaDto
  | CreateSingleLinkedRecordDto
  | MultipleLinkedRecordDto
  | RollupDto
  | DatetimeDto
  | SingleSelectDto
