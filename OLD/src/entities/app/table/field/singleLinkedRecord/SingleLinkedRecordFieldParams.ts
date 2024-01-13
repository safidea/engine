import * as t from 'io-ts'
import { BaseFieldParams } from '../base/BaseFieldParams'

export interface SingleLinkedRecordFieldParams extends BaseFieldParams {
  readonly type: 'single_linked_record'
  readonly table: string
}

export const SingleLinkedRecordFieldParams: t.Type<SingleLinkedRecordFieldParams> = t.intersection([
  BaseFieldParams,
  t.type({
    type: t.literal('single_linked_record'),
    table: t.string,
  }),
])
