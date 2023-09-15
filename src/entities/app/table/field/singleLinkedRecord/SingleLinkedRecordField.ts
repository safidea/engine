import { AppServices } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { SingleLinkedRecordFieldParams } from './SingleLinkedRecordFieldParams'

export class SingleLinkedRecordField extends BaseField {
  readonly table: string

  constructor(params: SingleLinkedRecordFieldParams, services: AppServices) {
    const { table, ...rest } = params
    super(rest, services)
    this.table = table
  }
}
