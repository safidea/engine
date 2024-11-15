import type { IBaseAction } from './base'

export interface ISingleLinkedRecordField extends IBaseAction {
  field: 'SingleLinkedRecord'
  table: string
}
