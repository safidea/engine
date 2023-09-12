import { AppDrivers } from '@entities/app/App'
import { FilterOptions } from './FilterOptions'
import { IsAnyOfFilter } from './filters/IsAnyOfFilter'
import { IsFilter } from './filters/IsFilter'
import { AutomationConfig } from '@entities/app/automation/Automation'

export type Filter = IsAnyOfFilter | IsFilter

export function newFilter(
  options: FilterOptions,
  drivers: AppDrivers,
  config: AutomationConfig
): Filter {
  const { field, operator, value } = options
  switch (operator) {
    case 'is_any_of':
      return new IsAnyOfFilter(field, value)
    case 'is':
      return new IsFilter(field, value)
    default:
      throw new Error(`Unknown filter operator: ${operator}`)
  }
}
