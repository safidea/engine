import type { FilterWithOperatorConfig } from '..'
import {
  IsAfterNumberOfSecondsSinceNowDateFilter,
  isAfterNumberOfSecondsSinceNowDateFilterSchema,
  type IsAfterNumberOfSecondsSinceNowDateFilterConfig,
} from './IsAfterNumberOfSecondsSinceNow'

export type DateFilterConfig = IsAfterNumberOfSecondsSinceNowDateFilterConfig

export const dateFilterSchemas = [isAfterNumberOfSecondsSinceNowDateFilterSchema]

export type DateFilter = IsAfterNumberOfSecondsSinceNowDateFilter

export const isDateFilter = (config: FilterWithOperatorConfig): config is DateFilterConfig => {
  return config.operator === 'IsAfterNumberOfSecondsSinceNow'
}

export class DateFilterMapper {
  static toEntity = (config: DateFilterConfig): DateFilter => {
    const { operator, field, value } = config
    switch (operator) {
      case 'IsAfterNumberOfSecondsSinceNow':
        return new IsAfterNumberOfSecondsSinceNowDateFilter(field, value)
    }
  }
}
