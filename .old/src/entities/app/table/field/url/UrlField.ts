import { TableServices } from '@entities/app/table/TableServices'

import { BaseField } from '../base/BaseField'
import { UrlFieldParams } from './UrlFieldParams'

export class UrlField extends BaseField {
  constructor(params: UrlFieldParams, services: TableServices) {
    super(params, services)
  }
}
