import type { FilterWithOperatorConfig } from '..'
import {
  containsTextFilterSchema,
  ContainsTextFilter,
  type ContainsTextFilterConfig,
} from './Contains'
import { IsTextFilter, isTextFilterSchema, type IsTextFilterConfig } from './Is'

export type TextFilterConfig = IsTextFilterConfig | ContainsTextFilterConfig

export const textFilterSchemas = [isTextFilterSchema, containsTextFilterSchema]

export type TextFilter = IsTextFilter | ContainsTextFilter

export const isTextFilter = (config: FilterWithOperatorConfig): config is TextFilterConfig => {
  return config.operator === 'Is' || config.operator === 'Contains'
}

export class TextFilterMapper {
  static toEntity = (config: TextFilterConfig): TextFilter => {
    const { operator, field, value } = config
    switch (operator) {
      case 'Is':
        return new IsTextFilter(field, value)
      case 'Contains':
        return new ContainsTextFilter(field, value)
    }
  }
}
