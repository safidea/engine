import type { FilterWithOperatorConfig } from '..'
import { IsFalse, isFalseSchema, type IsFalseConfig } from './IsFalse'
import { IsTrue, isTrueSchema, type IsTrueConfig } from './IsTrue'

export type BooleanConfig = IsFalseConfig | IsTrueConfig

export const booleanSchemas = [isFalseSchema, isTrueSchema]

export type Boolean = IsFalse | IsTrue

export const isBooleanFilter = (config: FilterWithOperatorConfig): config is BooleanConfig => {
  return config.operator === 'IsTrue' || config.operator === 'IsFalse'
}

export class BooleanMapper {
  static toEntity = (config: BooleanConfig): Boolean => {
    const { operator, field } = config
    switch (operator) {
      case 'IsTrue':
        return new IsTrue(field)
      case 'IsFalse':
        return new IsFalse(field)
    }
  }
}
