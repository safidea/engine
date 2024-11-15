import { BaseField, type BaseFieldParams } from './base'

interface MultipleLinkedRecordFieldParams extends BaseFieldParams {
  table: string
}

export class MultipleLinkedRecordField extends BaseField {
  table: string

  constructor(params: MultipleLinkedRecordFieldParams) {
    super(params)
    this.table = params.table
  }
}
