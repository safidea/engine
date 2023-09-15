import { AppServices } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { RollupFieldParams } from './RollupFieldParams'

export class RollupField extends BaseField {
  readonly linkedRecords: string
  readonly linkedField: string
  readonly formula: string

  constructor(params: RollupFieldParams, services: AppServices) {
    const { linkedRecords, linkedField, formula, ...rest } = params
    super(rest, services)
    this.linkedRecords = linkedRecords
    this.linkedField = linkedField
    this.formula = formula
  }
}
