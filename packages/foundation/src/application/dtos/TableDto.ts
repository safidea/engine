import { FieldFormulaDto } from './FieldFormulaDto'
import { FieldSingleLinkedRecordDto } from './FieldSingleLinkedRecordDto'
import { FieldRollupDto } from './FieldRollupDto'
import { FieldMultipleLinkedRecordDto } from './FieldMultipleLinkedRecordDto'
import { FieldLongTextDto } from './FieldLongTextDto'
import { FieldSingleLineTextDto } from './FieldSingleLineTextDto'
import { FieldNumberDto } from './FieldNumberDto'
import { FieldCurrencyDto } from './FieldCurrencyDto'

export interface TableDto {
  name: string
  fields: (
    | FieldFormulaDto
    | FieldSingleLinkedRecordDto
    | FieldMultipleLinkedRecordDto
    | FieldRollupDto
    | FieldSingleLineTextDto
    | FieldLongTextDto
    | FieldNumberDto
    | FieldCurrencyDto
  )[]
}
