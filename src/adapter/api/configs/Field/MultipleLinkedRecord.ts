import type { IBaseAction } from './base'

export interface IMultipleLinkedRecordField extends IBaseAction {
  field: 'MultipleLinkedRecord'
  table: string
}
