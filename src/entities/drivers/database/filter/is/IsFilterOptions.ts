import { BaseFilterOptions } from "../base/BaseFilterOptions"

export interface IsFilterOptions extends BaseFilterOptions {
  operator: 'is'
  value: string
}
