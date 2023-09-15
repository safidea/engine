import { AppDrivers } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { LongTextFieldParams } from './LongTextFieldParams'

export class LongTextField extends BaseField {
  constructor(params: LongTextFieldParams, drivers: AppDrivers) {
    super(params, drivers)
  }
}
