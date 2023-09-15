import { AppDrivers } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { DatetimeFieldParams } from './DatetimeFieldParams'

export class DatetimeField extends BaseField {
  constructor(params: DatetimeFieldParams, drivers: AppDrivers) {
    super(params, drivers)
  }
}
