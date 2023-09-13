import { AppDrivers } from '@entities/app/App'
import { NumberFieldOptions } from './NumberFieldOptions'
import { BaseField } from '../base/BaseField'

export class NumberField extends BaseField {
  constructor(options: NumberFieldOptions, drivers: AppDrivers) {
    super(options, drivers)
  }
}
