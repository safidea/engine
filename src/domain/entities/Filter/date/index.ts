import type { FilterWithOperatorConfig } from '..'
import {
  IsAfterNumberOfSecondsSinceNow,
  isAfterNumberOfSecondsSinceNowSchema,
  type IsAfterNumberOfSecondsSinceNowConfig,
} from './IsAfterNumberOfSecondsSinceNow'

export type DateConfig = IsAfterNumberOfSecondsSinceNowConfig

export const dateSchemas = [isAfterNumberOfSecondsSinceNowSchema]

export type Date = IsAfterNumberOfSecondsSinceNow

export const isDateFilter = (config: FilterWithOperatorConfig): config is DateConfig => {
  return config.operator === 'IsAfterNumberOfSecondsSinceNow'
}

export class DateMapper {
  static toEntity = (config: DateConfig): Date => {
    const { operator, field, value } = config
    switch (operator) {
      case 'IsAfterNumberOfSecondsSinceNow':
        return new IsAfterNumberOfSecondsSinceNow(field, value)
    }
  }
}
