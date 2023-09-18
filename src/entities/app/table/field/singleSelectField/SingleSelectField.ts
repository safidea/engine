import { TableServices } from '@entities/app/table/TableServices'

import { BaseField } from '../base/BaseField'
import { SingleSelectFieldParams } from './SingleSelectFieldParams'

export class SingleSelectField extends BaseField {
  readonly options: string[]

  constructor(params: SingleSelectFieldParams, services: TableServices) {
    const { options, ...rest } = params
    super(rest, services)
    this.options = options
  }
}
