import { Filter } from '@entities/orm/Filter'
import { AutomationContext, AutomationUseCases } from '../Automation'
import { BaseTrigger } from './BaseTrigger'
import { IsFilter } from '@entities/orm/filters/IsFilter'

export class RecordCreatedTrigger extends BaseTrigger {
  constructor(
    private _table: string,
    private _filters: Filter[] = []
  ) {
    super('record_created')
  }

  get table(): string {
    return this._table
  }

  get filters(): Filter[] {
    return this._filters
  }

  async shouldTrigger(
    event: string,
    context: AutomationContext,
    { readTableRecord }: AutomationUseCases
  ): Promise<boolean> {
    if (!super.shouldTriggerEvent(event)) return false
    if (context.table !== this._table) return false
    if ('id' in context && this._filters.length > 0) {
      const record = await readTableRecord.execute(this._table, String(context.id))
      if (!record) throw new Error(`Record "${context.id}" not found in table ${this._table}`)
      for (const filter of this._filters) {
        if (filter instanceof IsFilter && filter.value !== record.getFieldValue(filter.field)) {
          return false
        }
      }
    }
    return true
  }
}
