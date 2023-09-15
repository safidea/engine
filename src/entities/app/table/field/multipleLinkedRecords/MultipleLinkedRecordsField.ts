import { AppDrivers } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { MultipleLinkedRecordsFieldParams } from './MultipleLinkedRecordsFieldParams'

export class MultipleLinkedRecordsField extends BaseField {
  readonly table: string

  constructor(params: MultipleLinkedRecordsFieldParams, drivers: AppDrivers) {
    const { table, ...rest } = params
    super(rest, drivers)
    this.table = table
  }
}
