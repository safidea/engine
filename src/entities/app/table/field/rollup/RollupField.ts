import { AppDrivers } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { RollupFieldOptions } from './RollupFieldOptions'

export class RollupField extends BaseField {
  readonly linkedRecords: string
  readonly linkedField: string
  readonly formula: string

  constructor(options: RollupFieldOptions, drivers: AppDrivers) {
    const { linkedRecords, linkedField, formula, ...rest } = options
    super(rest, drivers)
    this.linkedRecords = linkedRecords
    this.linkedField = linkedField
    this.formula = formula
  }
}
