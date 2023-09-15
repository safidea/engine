import { AppServices } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { DatetimeFieldParams } from './DatetimeFieldParams'

export class DatetimeField extends BaseField {
  constructor(params: DatetimeFieldParams, services: AppServices) {
    super(params, services)
  }
}
