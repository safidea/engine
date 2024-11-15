import { BaseField, type BaseFieldParams } from './base'

interface SingleLinkedRecordFieldParams extends BaseFieldParams {
  table: string
}

export class SingleLinkedRecordField extends BaseField {
  table: string

  constructor(params: SingleLinkedRecordFieldParams) {
    super(params)
    this.table = params.table
  }
}
