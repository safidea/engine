import { AppDrivers } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { DatetimeFieldOptions } from './DatetimeFieldOptions'

export class DatetimeField extends BaseField {
  constructor(options: DatetimeFieldOptions, drivers: AppDrivers) {
    super(options, drivers)
  }
}
