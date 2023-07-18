import { FieldDto } from './FieldDto'
import { FieldFormulaDto } from './FieldFormulaDto'
import { FieldSingleLinkedRecordDto } from './FieldSingleLinkedRecordDto'
import { FieldRollupDto } from './FieldRollupDto'
import { FieldMultipleLinkedRecordDto } from './FieldMultipleLinkedRecordDto'

export interface TableDto {
  name: string
  fields: (
    | FieldDto
    | FieldFormulaDto
    | FieldSingleLinkedRecordDto
    | FieldMultipleLinkedRecordDto
    | FieldRollupDto
  )[]
}
