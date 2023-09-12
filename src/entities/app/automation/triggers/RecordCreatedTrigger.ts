import { Filter } from '@entities/drivers/database/Filter'
import { AutomationConfig, AutomationContext } from '../Automation'
import { BaseTrigger } from './BaseTrigger'
import { IsFilter } from '@entities/drivers/database/filters/IsFilter'
import { AppDrivers } from '@entities/app/App'
import { RecordCreatedTriggerOptions } from './RecordCreatedTriggerOptions'
import { Table } from '@entities/app/table/Table'

export class RecordCreatedTrigger extends BaseTrigger {
  private table: Table
  private filters: Filter[]

  constructor(options: RecordCreatedTriggerOptions, drivers: AppDrivers, config: AutomationConfig) {
    const { event, table: tableName, filters = [] } = options
    super({ event }, drivers, config)
    this.table = this.getTableByName(tableName)
    this.filters = this.getFiltersFromOptions(filters)
  }

  async shouldTrigger(event: string, context: AutomationContext): Promise<boolean> {
    if (!super.shouldTriggerEvent(event)) return false
    if (context.table !== this.table.name) return false
    if ('id' in context && this.filters.length > 0) {
      const record = await this.drivers.database.read(this.table.name, String(context.id))
      if (!record) throw new Error(`Record "${context.id}" not found in table ${this.table.name}`)
      for (const filter of this.filters) {
        if (filter instanceof IsFilter && filter.value !== record.getFieldValue(filter.field)) {
          return false
        }
      }
    }
    return true
  }
}
