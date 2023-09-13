import { AppDrivers } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { MultipleLinkedRecordsFieldOptions } from './MultipleLinkedRecordsFieldOptions'

export class MultipleLinkedRecordsField extends BaseField {
  readonly table: string

  constructor(options: MultipleLinkedRecordsFieldOptions, drivers: AppDrivers) {
    const { table, ...rest } = options
    super(rest, drivers)
    this.table = table
  }
}
