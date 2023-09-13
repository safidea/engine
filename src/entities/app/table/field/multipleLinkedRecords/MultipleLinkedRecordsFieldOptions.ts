import { BaseFieldOptions } from '../base/BaseFieldOptions'

export interface MultipleLinkedRecordsFieldOptions extends BaseFieldOptions {
  type: 'multiple_linked_records'
  table: string
}
