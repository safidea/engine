import type { FilterWithOperatorConfig } from '..'
import { IsFalseBooleanFilter, isFalseSchema, type IsFalseBooleanFilterConfig } from './IsFalse'
import { IsTrueBooleanFilter, isTrueSchema, type IsTrueBooleanFilterConfig } from './IsTrue'

export type BooleanFilterConfig = IsFalseBooleanFilterConfig | IsTrueBooleanFilterConfig

export const booleanFilterSchemas = [isFalseSchema, isTrueSchema]

export type BooleanFilter = IsFalseBooleanFilter | IsTrueBooleanFilter

export const isBooleanFilter = (
  config: FilterWithOperatorConfig
): config is BooleanFilterConfig => {
  return config.operator === 'IsTrue' || config.operator === 'IsFalse'
}

export class BooleanFilterMapper {
  static toEntity = (config: BooleanFilterConfig): BooleanFilter => {
    const { operator, field } = config
    switch (operator) {
      case 'IsTrue':
        return new IsTrueBooleanFilter(field)
      case 'IsFalse':
        return new IsFalseBooleanFilter(field)
    }
  }
}
