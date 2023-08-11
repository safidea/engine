import { BaseTrigger } from './BaseTrigger'

export class RecordCreatedTrigger extends BaseTrigger {
  constructor(private _table: string) {
    super('record_created')
  }

  get table(): string {
    return this._table
  }
}
