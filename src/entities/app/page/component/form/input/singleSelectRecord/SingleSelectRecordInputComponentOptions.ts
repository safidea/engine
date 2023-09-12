import { BaseInputComponentOptions } from '../base/BaseInputComponentOptions'

export interface SingleSelectRecordInputComponentOptions extends BaseInputComponentOptions {
  type: 'single_select_record'
  placeholder?: string
  table: string
  fieldForOptionLabel?: string
}
