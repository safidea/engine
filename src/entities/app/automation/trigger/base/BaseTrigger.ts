import { AppServices } from '@entities/app/App'
import { AutomationConfig } from '../../Automation'
import { BaseTriggerParams } from './BaseTriggerParams'
import { Table } from '@entities/app/table/Table'
import { TriggerError } from '../TriggerError'
import { FilterParams } from '@entities/services/database/filter/FilterParams'
import { Filter, newFilter } from '@entities/services/database/filter/Filter'

export class BaseTrigger {
  readonly event: string

  constructor(
    options: BaseTriggerParams,
    readonly services: AppServices,
    readonly config: AutomationConfig
  ) {
    const { event } = options
    this.event = event
  }

  throwError(message: string): never {
    throw new TriggerError(this.event, message, this.config.automationName)
  }

  getTableByName(tableName: string): Table {
    const table = this.config.tables.getByName(tableName)
    if (!table) this.throwError(`table ${tableName} not found`)
    return table
  }

  getFiltersFromParams(filtersParams: FilterParams[]): Filter[] {
    return filtersParams.map((filterParams: FilterParams) => newFilter(filterParams))
  }

  shouldTriggerEvent(event: string): boolean {
    return this.event === event
  }
}
