export type Format =
  | 'text'
  | 'number'
  | 'currency'
  | 'datetime'
  | 'boolean'
  | 'recordId'
  | 'recordsIds'

export interface BaseFieldOptions {
  type: string
  name: string
  optional?: boolean
  format?: Format
  default?: string | number | boolean
  permissions?: {
    update?: boolean | { formula: string }
  }
}
