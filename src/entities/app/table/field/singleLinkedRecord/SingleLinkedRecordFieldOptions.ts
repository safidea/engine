import { BaseFieldOptions } from '../base/BaseFieldOptions'

export interface SingleLinkedRecordFieldOptions extends BaseFieldOptions {
  type: 'single_linked_record'
  table: string
}
