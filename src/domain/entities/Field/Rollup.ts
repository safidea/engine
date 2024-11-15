import { BaseField, type BaseFieldParams } from './base'
import type { DateTimeField } from './DateTime'
import type { LongTextField } from './LongText'
import type { MultipleLinkedRecordField } from './MultipleLinkedRecord'
import type { NumberField } from './Number'
import type { SingleLineTextField } from './SingleLineText'

interface RollupFieldParams extends BaseFieldParams {
  formula: string
  multipleLinkedRecord: MultipleLinkedRecordField
  linkedRecordField: string
  output: NumberField | LongTextField | SingleLineTextField | DateTimeField
}

export class RollupField extends BaseField {
  formula: string
  multipleLinkedRecord: MultipleLinkedRecordField
  linkedRecordField: string
  output: NumberField | LongTextField | SingleLineTextField | DateTimeField

  constructor(params: RollupFieldParams) {
    super(params)
    this.formula = params.formula
    this.multipleLinkedRecord = params.multipleLinkedRecord
    this.linkedRecordField = params.linkedRecordField
    this.output = params.output
  }

  get table() {
    return this.multipleLinkedRecord.table
  }
}
