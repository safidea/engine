import type { FilterWithOperatorConfig } from '..'
import { IsAnyOf, isAnyOfSchema, type IsAnyOfConfig } from './IsAnyOf'

export type SelectConfig = IsAnyOfConfig

export const selectSchemas = [isAnyOfSchema]

export type Select = IsAnyOf

export const isSelectFilter = (config: FilterWithOperatorConfig): config is SelectConfig => {
  return config.operator === 'IsAnyOf'
}

export class SelectMapper {
  static toEntity = (config: SelectConfig): Select => {
    const { operator, field, value } = config
    switch (operator) {
      case 'IsAnyOf':
        return new IsAnyOf(field, value)
    }
  }
}
