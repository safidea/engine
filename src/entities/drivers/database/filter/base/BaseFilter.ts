import { BaseFilterOptions } from './BaseFilterOptions'

export class BaseFilter {
  readonly field: string
  readonly operator: string

  constructor(options: BaseFilterOptions) {
    const { field, operator } = options
    this.field = field
    this.operator = operator
  }
}
