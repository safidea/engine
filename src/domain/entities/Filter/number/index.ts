import type { FilterWithOperatorConfig } from '..'
import {
  EqualsNumberFilter,
  equalNumberFilterSchema,
  type EqualsNumberFilterConfig,
} from './Equals'

export type NumberFilterConfig = EqualsNumberFilterConfig

export const numberFilterSchemas = [equalNumberFilterSchema]

export type NumberFilter = EqualsNumberFilter

export const isNumberFilter = (
  config: FilterWithOperatorConfig
): config is EqualsNumberFilterConfig => {
  return config.operator === 'Equals'
}

export class NumberFilterMapper {
  static toEntity = (config: NumberFilterConfig): NumberFilter => {
    const { operator, field, value } = config
    switch (operator) {
      case 'Equals':
        return new EqualsNumberFilter(field, value)
    }
  }
}
