import { TableServices } from '@entities/app/table/TableServices'

import { BaseField } from '../base/BaseField'
import { DatetimeFieldParams } from './DatetimeFieldParams'

export class DatetimeField extends BaseField {
  constructor(params: DatetimeFieldParams, services: TableServices) {
    super(params, services)
  }
}
