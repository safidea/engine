import { AppDrivers } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { SingleLineTextFieldParams } from './SingleLineTextFieldParams'

export class SingleLineTextField extends BaseField {
  constructor(params: SingleLineTextFieldParams, drivers: AppDrivers) {
    super(params, drivers)
  }
}
