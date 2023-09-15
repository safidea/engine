import { AppServices } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { CurrencyFieldParams } from './CurrencyFieldParams'

export class CurrencyField extends BaseField {
  constructor(params: CurrencyFieldParams, services: AppServices) {
    super(params, services)
  }
}
