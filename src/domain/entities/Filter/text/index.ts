import type { FilterWithOperatorConfig } from '..'
import { IsTextFilter, isTextFilterSchema, type IsTextFilterConfig } from './Is'

export type TextFilterConfig = IsTextFilterConfig

export const textFilterSchemas = [isTextFilterSchema]

export type TextFilter = IsTextFilter

export const isTextFilter = (config: FilterWithOperatorConfig): config is TextFilterConfig => {
  return config.operator === 'Is'
}

export class TextFilterMapper {
  static toEntity = (config: TextFilterConfig): TextFilter => {
    const { operator, field, value } = config
    switch (operator) {
      case 'Is':
        return new IsTextFilter(field, value)
    }
  }
}
