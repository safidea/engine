import { Filter } from '@entities/services/database/filter/Filter'
import { AutomationConfig } from '../../../Automation'
import { BaseTrigger } from '../../base/BaseTrigger'
import { IsFilter } from '@entities/services/database/filter/is/IsFilter'
import { RecordCreatedTriggerParams } from './RecordCreatedTriggerParams'
import { Table } from '@entities/app/table/Table'
import { TriggerEvent } from '../../TriggerEvent'
import { AutomationServices } from '@entities/app/automation/AutomationServices'

export class RecordCreatedTrigger extends BaseTrigger {
  private table: Table
  private filters: Filter[]

  constructor(params: RecordCreatedTriggerParams, services: AutomationServices, config: AutomationConfig) {
    const { event, table: tableName, filters = [] } = params
    super({ event }, services, config)
    this.table = this.getTableByName(tableName)
    this.filters = this.getFiltersFromParams(filters)
  }

  async shouldTrigger({ event, context }: TriggerEvent): Promise<boolean> {
    if (event !== 'record_created') return false
    if (context.table !== this.table.name) return false
    if ('id' in context && this.filters.length > 0) {
      const record = await this.services.database.read(this.table, String(context.id))
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
