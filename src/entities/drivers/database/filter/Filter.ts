import { FilterOptions } from './FilterOptions'
import { IsAnyOfFilter } from './isAnyOf/IsAnyOfFilter'
import { IsFilter } from './is/IsFilter'

export type Filter = IsAnyOfFilter | IsFilter

export function newFilter(options: FilterOptions): Filter {
  switch (options.operator) {
    case 'is_any_of':
      return new IsAnyOfFilter(options)
    case 'is':
      return new IsFilter(options)
  }
}
