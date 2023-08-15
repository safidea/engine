import { BaseTrigger } from './BaseTrigger'

export class RecordUpdatedTrigger extends BaseTrigger {
  constructor(private _table: string) {
    super('record_updated')
  }

  get table(): string {
    return this._table
  }
}
