import { AppDrivers } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { SingleLinkedRecordFieldParams } from './SingleLinkedRecordFieldParams'

export class SingleLinkedRecordField extends BaseField {
  readonly table: string

  constructor(params: SingleLinkedRecordFieldParams, drivers: AppDrivers) {
    const { table, ...rest } = params
    super(rest, drivers)
    this.table = table
  }
}
