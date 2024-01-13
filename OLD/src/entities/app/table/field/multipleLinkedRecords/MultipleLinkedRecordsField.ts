import { TableServices } from '@entities/app/table/TableServices'

import { BaseField } from '../base/BaseField'
import { MultipleLinkedRecordsFieldParams } from './MultipleLinkedRecordsFieldParams'

export class MultipleLinkedRecordsField extends BaseField {
  readonly table: string

  constructor(params: MultipleLinkedRecordsFieldParams, services: TableServices) {
    const { table, ...rest } = params
    super(rest, services)
    this.table = table
  }
}
