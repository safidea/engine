import { IsFilterOptions } from './is/IsFilterOptions'
import { IsAnyOfFilterOptions } from './isAnyOf/IsAnyOfFilterOptions'

export type FilterOptions = IsAnyOfFilterOptions | IsFilterOptions
