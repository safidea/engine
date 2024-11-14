import type { FilterWithOperatorConfig } from '..'
import { Equals, equalSchema, type EqualsConfig } from './Equals'

export type NumberConfig = EqualsConfig

export const numberSchemas = [equalSchema]

export type Number = Equals

export const isNumberFilter = (config: FilterWithOperatorConfig): config is EqualsConfig => {
  return config.operator === 'Equals'
}

export class NumberMapper {
  static toEntity = (config: NumberConfig): Number => {
    const { operator, field, value } = config
    switch (operator) {
      case 'Equals':
        return new Equals(field, value)
    }
  }
}
