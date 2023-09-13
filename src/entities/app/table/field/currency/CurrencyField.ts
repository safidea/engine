import { AppDrivers } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { CurrencyFieldOptions } from './CurrencyFieldOptions'

export class CurrencyField extends BaseField {
  constructor(options: CurrencyFieldOptions, drivers: AppDrivers) {
    super(options, drivers)
  }
}
