import { BaseFieldOptions } from '../base/BaseFieldOptions'

export interface RollupFieldOptions extends BaseFieldOptions {
  type: 'rollup'
  linkedRecords: string
  linkedField: string
  formula: string
}
