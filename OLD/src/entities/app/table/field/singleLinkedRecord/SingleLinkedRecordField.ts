import { TableServices } from '@entities/app/table/TableServices'

import { BaseField } from '../base/BaseField'
import { SingleLinkedRecordFieldParams } from './SingleLinkedRecordFieldParams'

export class SingleLinkedRecordField extends BaseField {
  readonly table: string

  constructor(params: SingleLinkedRecordFieldParams, services: TableServices) {
    const { table, ...rest } = params
    super(rest, services)
    this.table = table
  }
}
