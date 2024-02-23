import { TableServices } from '@entities/app/table/TableServices'

import { BaseField } from '../base/BaseField'
import { AutonumberFieldParams } from './AutonumberFieldParams'

export class AutonumberField extends BaseField {
  constructor(params: AutonumberFieldParams, services: TableServices) {
    super(params, services)
  }
}
