import type { FilterWithOperatorConfig } from '..'
import {
  IsAnyOfSelectFilter,
  isAnyOfSelectFilterSchema,
  type IsAnyOfSelectFilterConfig,
} from './IsAnyOf'

export type SelectFilterConfig = IsAnyOfSelectFilterConfig

export const selectFilterSchemas = [isAnyOfSelectFilterSchema]

export type SelectFilter = IsAnyOfSelectFilter

export const isSelectFilter = (config: FilterWithOperatorConfig): config is SelectFilterConfig => {
  return config.operator === 'IsAnyOf'
}

export class SelectFilterMapper {
  static toEntity = (config: SelectFilterConfig): SelectFilter => {
    const { operator, field, value } = config
    switch (operator) {
      case 'IsAnyOf':
        return new IsAnyOfSelectFilter(field, value)
    }
  }
}
