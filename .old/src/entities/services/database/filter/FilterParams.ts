import * as t from 'io-ts'
import { IsFilterParams } from './is/IsFilterParams'
import { IsAnyOfFilterParams } from './isAnyOf/IsAnyOfFilterParams'

export const FilterParams = t.union([IsAnyOfFilterParams, IsFilterParams])

export type FilterParams = IsAnyOfFilterParams | IsFilterParams
