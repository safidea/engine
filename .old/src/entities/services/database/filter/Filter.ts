import { FilterParams } from './FilterParams'
import { IsAnyOfFilter } from './isAnyOf/IsAnyOfFilter'
import { IsFilter } from './is/IsFilter'

export type Filter = IsAnyOfFilter | IsFilter

export function newFilter(params: FilterParams): Filter {
  switch (params.operator) {
    case 'is_any_of':
      return new IsAnyOfFilter(params)
    case 'is':
      return new IsFilter(params)
  }
}
