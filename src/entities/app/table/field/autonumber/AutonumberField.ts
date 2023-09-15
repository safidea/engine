import { AppDrivers } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { AutonumberFieldParams } from './AutonumberFieldParams'

export class AutonumberField extends BaseField {
  constructor(params: AutonumberFieldParams, drivers: AppDrivers) {
    super(params, drivers)
  }
}
