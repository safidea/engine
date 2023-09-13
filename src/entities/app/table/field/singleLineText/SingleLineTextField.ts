import { AppDrivers } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { SingleLineTextFieldOptions } from './SingleLineTextFieldOptions'

export class SingleLineTextField extends BaseField {
  constructor(options: SingleLineTextFieldOptions, drivers: AppDrivers) {
    super(options, drivers)
  }
}
