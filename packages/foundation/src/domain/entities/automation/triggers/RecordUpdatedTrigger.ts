import { AutomationContext } from '../Automation'
import { BaseTrigger } from './BaseTrigger'

export class RecordUpdatedTrigger extends BaseTrigger {
  constructor(private _table: string) {
    super('record_updated')
  }

  get table(): string {
    return this._table
  }

  shouldTrigger(event: string, context: AutomationContext): boolean {
    return super.shouldTriggerEvent(event) && context.table === this._table
  }
}
