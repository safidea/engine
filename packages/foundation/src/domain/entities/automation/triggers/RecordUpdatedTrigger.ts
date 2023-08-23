import { AutomationContext } from '../Automation'
import { BaseTrigger } from './BaseTrigger'

export class RecordUpdatedTrigger extends BaseTrigger {
  constructor(
    private _table: string,
    private _fields: string[] = []
  ) {
    super('record_updated')
  }

  get table(): string {
    return this._table
  }

  get fields(): string[] {
    return this._fields
  }

  shouldTrigger(event: string, context: AutomationContext): boolean {
    const isSameTable = context.table === this._table
    const isSameEvent = event === this.event
    let isSameFields = true
    if (this._fields.length > 0 && Array.isArray(context.updatedFields)) {
      isSameFields = false
      for (const field of context.updatedFields ?? []) {
        if (this._fields.includes(String(field))) {
          isSameFields = true
        }
      }
    }
    return isSameTable && isSameEvent && isSameFields
  }
}
