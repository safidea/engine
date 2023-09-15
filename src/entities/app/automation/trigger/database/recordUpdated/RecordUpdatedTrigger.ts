import { Filter } from '@entities/drivers/database/filter/Filter'
import { AutomationConfig, AutomationContext } from '../../../Automation'
import { BaseTrigger } from '../../base/BaseTrigger'
import { IsFilter } from '@entities/drivers/database/filter/is/IsFilter'
import { RecordUpdatedTriggerParams } from './RecordUpdatedTriggerParams'
import { AppDrivers } from '@entities/app/App'
import { Table } from 'src'

export class RecordUpdatedTrigger extends BaseTrigger {
  private table: Table
  private filters: Filter[]
  private fields: string[] = []

  constructor(params: RecordUpdatedTriggerParams, drivers: AppDrivers, config: AutomationConfig) {
    const { event, table: tableName, fields = [], filters = [] } = params
    super({ event }, drivers, config)
    this.table = this.getTableByName(tableName)
    this.filters = this.getFiltersFromParams(filters)
    this.fields = fields
  }

  async shouldTrigger(event: string, context: AutomationContext): Promise<boolean> {
    if (!super.shouldTriggerEvent(event)) return false
    if (context.table !== this.table.name) return false
    if (this.fields.length > 0 && Array.isArray(context.updatedFields)) {
      for (const field of context.updatedFields ?? []) {
        if (!this.fields.includes(String(field))) {
          return false
        }
      }
    }
    if ('id' in context && this.filters.length > 0) {
      const record = await this.drivers.database.read(this.table, String(context.id))
      if (!record) return false
      for (const filter of this.filters) {
        if (filter instanceof IsFilter && filter.value !== record.getFieldValue(filter.field)) {
          return false
        }
      }
    }
    return true
  }
}
