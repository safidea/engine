import { BaseField } from './BaseField'

export class MultipleLinkedRecords extends BaseField {
  constructor(
    name: string,
    private readonly _table: string,
    optional?: boolean
  ) {
    super(name, 'multiple_linked_records', optional, 'recordsIds')
  }

  get table(): string {
    return this._table
  }
}
