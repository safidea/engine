import { AppDrivers } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { SingleLinkedRecordFieldOptions } from './SingleLinkedRecordFieldOptions'

export class SingleLinkedRecordField extends BaseField {
  readonly table: string

  constructor(options: SingleLinkedRecordFieldOptions, drivers: AppDrivers) {
    const { table, ...rest } = options
    super(rest, drivers)
    this.table = table
  }
}
