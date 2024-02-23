import { TableServices } from '@entities/app/table/TableServices'

import { BaseField } from '../base/BaseField'
import { CurrencyFieldParams } from './CurrencyFieldParams'

export class CurrencyField extends BaseField {
  constructor(params: CurrencyFieldParams, services: TableServices) {
    super(params, services)
  }
}
