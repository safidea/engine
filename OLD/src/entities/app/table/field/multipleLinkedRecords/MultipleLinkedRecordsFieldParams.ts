import * as t from 'io-ts'
import { BaseFieldParams } from '../base/BaseFieldParams'

export interface MultipleLinkedRecordsFieldParams extends BaseFieldParams {
  readonly type: 'multiple_linked_records'
  readonly table: string
}

export const MultipleLinkedRecordsFieldParams: t.Type<MultipleLinkedRecordsFieldParams> =
  t.intersection([
    BaseFieldParams,
    t.type({
      type: t.literal('multiple_linked_records'),
      table: t.string,
    }),
  ])
