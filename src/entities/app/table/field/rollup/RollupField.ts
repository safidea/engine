import { AppDrivers } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { RollupFieldParams } from './RollupFieldParams'

export class RollupField extends BaseField {
  readonly linkedRecords: string
  readonly linkedField: string
  readonly formula: string

  constructor(params: RollupFieldParams, drivers: AppDrivers) {
    const { linkedRecords, linkedField, formula, ...rest } = params
    super(rest, drivers)
    this.linkedRecords = linkedRecords
    this.linkedField = linkedField
    this.formula = formula
  }
}
