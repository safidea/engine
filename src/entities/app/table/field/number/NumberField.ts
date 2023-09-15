import { AppDrivers } from '@entities/app/App'
import { NumberFieldParams } from './NumberFieldParams'
import { BaseField } from '../base/BaseField'

export class NumberField extends BaseField {
  constructor(params: NumberFieldParams, drivers: AppDrivers) {
    super(params, drivers)
  }
}
