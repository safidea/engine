import { AppDrivers } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { LongTextFieldOptions } from './LongTextFieldOptions'

export class LongTextField extends BaseField {
  constructor(options: LongTextFieldOptions, drivers: AppDrivers) {
    super(options, drivers)
  }
}
