import { TableServices } from '@entities/app/table/TableServices'

import { BaseField } from '../base/BaseField'
import { RollupFieldParams } from './RollupFieldParams'

export class RollupField extends BaseField {
  readonly linkedRecords: string
  readonly linkedField: string
  readonly formula: string

  constructor(params: RollupFieldParams, services: TableServices) {
    const { linkedRecords, linkedField, formula, ...rest } = params
    super(rest, services)
    this.linkedRecords = linkedRecords
    this.linkedField = linkedField
    this.formula = formula
  }
}
