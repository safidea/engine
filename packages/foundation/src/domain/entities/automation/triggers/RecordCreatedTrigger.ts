import { AutomationContext } from '../Automation'
import { BaseTrigger } from './BaseTrigger'

export class RecordCreatedTrigger extends BaseTrigger {
  constructor(private _table: string) {
    super('record_created')
  }

  get table(): string {
    return this._table
  }

  shouldTrigger(event: string, context: AutomationContext): boolean {
    return super.shouldTriggerEvent(event) && context.table === this._table
  }
}
