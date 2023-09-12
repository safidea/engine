import { BaseInputComponentOptions } from '../base/BaseInputComponentOptions'

export interface SingleSelectInputComponentOptions extends BaseInputComponentOptions {
  type: 'single_select'
  placeholder?: string
  options: { value: string; label: string }[]
}
