import { BaseInputComponentOptions } from '../base/BaseInputComponentOptions'

export interface TextInputComponentOptions extends BaseInputComponentOptions {
  type: 'text'
  placeholder?: string
}
