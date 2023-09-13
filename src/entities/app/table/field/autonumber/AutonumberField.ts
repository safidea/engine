import { AppDrivers } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { AutonumberFieldOptions } from './AutonumberFieldOptions'

export class AutonumberField extends BaseField {
  constructor(options: AutonumberFieldOptions, drivers: AppDrivers) {
    super(options, drivers)
  }
}
