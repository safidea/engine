import type { FilterWithOperatorConfig } from '..'
import { Is, isSchema, type IsConfig } from './Is'

export type TextConfig = IsConfig

export const textSchemas = [isSchema]

export type Text = Is

export const isTextFilter = (config: FilterWithOperatorConfig): config is TextConfig => {
  return config.operator === 'Is'
}

export class TextMapper {
  static toEntity = (config: TextConfig): Text => {
    const { operator, field, value } = config
    switch (operator) {
      case 'Is':
        return new Is(field, value)
    }
  }
}
