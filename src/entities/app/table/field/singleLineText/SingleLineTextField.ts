import { TableServices } from '@entities/app/table/TableServices'

import { BaseField } from '../base/BaseField'
import { SingleLineTextFieldParams } from './SingleLineTextFieldParams'

export class SingleLineTextField extends BaseField {
  constructor(params: SingleLineTextFieldParams, services: TableServices) {
    super(params, services)
  }
}
