import { AppServices } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { MultipleLinkedRecordsFieldParams } from './MultipleLinkedRecordsFieldParams'

export class MultipleLinkedRecordsField extends BaseField {
  readonly table: string

  constructor(params: MultipleLinkedRecordsFieldParams, services: AppServices) {
    const { table, ...rest } = params
    super(rest, services)
    this.table = table
  }
}
