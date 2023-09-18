import { TableServices } from '@entities/app/table/TableServices'

import { NumberFieldParams } from './NumberFieldParams'
import { BaseField } from '../base/BaseField'

export class NumberField extends BaseField {
  constructor(params: NumberFieldParams, services: TableServices) {
    super(params, services)
  }
}
