import { Filter } from '@entities/orm/Filter'
import { AutomationContext, AutomationUseCases } from '../Automation'
import { BaseTrigger } from './BaseTrigger'
import { IsFilter } from '@entities/orm/filters/IsFilter'

export class RecordUpdatedTrigger extends BaseTrigger {
  constructor(
    private _table: string,
    private _fields: string[] = [],
    private _filters: Filter[] = []
  ) {
    super('record_updated')
  }

  get table(): string {
    return this._table
  }

  get fields(): string[] {
    return this._fields
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
    if (this._fields.length > 0 && Array.isArray(context.updatedFields)) {
      for (const field of context.updatedFields ?? []) {
        if (!this._fields.includes(String(field))) {
          return false
        }
      }
    }
    if ('id' in context && this._filters.length > 0) {
      const record = await readTableRecord.execute(this._table, String(context.id))
      for (const filter of this._filters) {
        if (filter instanceof IsFilter && filter.value !== record.getFieldValue(filter.field)) {
          return false
        }
      }
    }
    return true
  }
}
