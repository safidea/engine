import type { FilterWithOperatorConfig } from '..'
import {
  OnOrAfterDateFilter,
  onOrAfterDateFilterSchema,
  type OnOrAfterDateFilterConfig,
} from './OnOrAfter'

export type DateFilterConfig = OnOrAfterDateFilterConfig

export const dateFilterSchemas = [onOrAfterDateFilterSchema]

export type DateFilter = OnOrAfterDateFilter

export const isDateFilter = (config: FilterWithOperatorConfig): config is DateFilterConfig => {
  return config.operator === 'OnOrAfter'
}

export class DateFilterMapper {
  static toEntity = (config: DateFilterConfig): DateFilter => {
    const { operator, field, value } = config
    switch (operator) {
      case 'OnOrAfter':
        return new OnOrAfterDateFilter(field, value)
    }
  }
}
