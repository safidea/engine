import { BaseField } from './BaseField'

export class SingleLinkedRecord extends BaseField {
  constructor(
    name: string,
    private readonly _table: string,
    optional?: boolean
  ) {
    super(name, 'single_linked_record', optional, 'recordId')
  }

  get table(): string {
    return this._table
  }
}
