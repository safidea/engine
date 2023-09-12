import { BaseInputComponentOptions } from '../base/BaseInputComponentOptions'

export interface TableInputComponentOptions extends BaseInputComponentOptions {
  type: 'table'
  columns: {
    label: string
    field: string
    placeholder?: string
  }[]
  addLabel?: string
}
