import { AppDrivers } from '@entities/app/App'
import { AutomationConfig } from '../../Automation'
import { BaseTriggerOptions } from './BaseTriggerOptions'
import { Table } from '@entities/app/table/Table'
import { TriggerError } from '../TriggerError'
import { FilterOptions } from '@entities/drivers/database/filter/FilterOptions'
import { Filter, newFilter } from '@entities/drivers/database/filter/Filter'

export class BaseTrigger {
  readonly event: string

  constructor(
    options: BaseTriggerOptions,
    readonly drivers: AppDrivers,
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

  getFiltersFromOptions(filtersOptions: FilterOptions[]): Filter[] {
    return filtersOptions.map((filterOptions: FilterOptions) => newFilter(filterOptions))
  }

  shouldTriggerEvent(event: string): boolean {
    return this.event === event
  }
}
