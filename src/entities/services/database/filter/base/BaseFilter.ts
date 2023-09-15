import { BaseFilterParams } from './BaseFilterParams'

export class BaseFilter {
  readonly field: string
  readonly operator: string

  constructor(params: BaseFilterParams) {
    const { field, operator } = params
    this.field = field
    this.operator = operator
  }
}
