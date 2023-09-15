import { AppDrivers } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { CurrencyFieldParams } from './CurrencyFieldParams'

export class CurrencyField extends BaseField {
  constructor(params: CurrencyFieldParams, drivers: AppDrivers) {
    super(params, drivers)
  }
}
