import { BaseFilterOptions } from '../base/BaseFilterOptions'

export interface IsAnyOfFilterOptions extends BaseFilterOptions {
  field: string
  operator: 'is_any_of'
  value: string[]
}
