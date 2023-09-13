import { BaseFieldOptions } from '../base/BaseFieldOptions'

export interface SingleSelectFieldOptions extends BaseFieldOptions {
  type: 'single_select'
  options: string[]
}
