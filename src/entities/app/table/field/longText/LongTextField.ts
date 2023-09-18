import { TableServices } from '@entities/app/table/TableServices'

import { BaseField } from '../base/BaseField'
import { LongTextFieldParams } from './LongTextFieldParams'

export class LongTextField extends BaseField {
  constructor(params: LongTextFieldParams, services: TableServices) {
    super(params, services)
  }
}
