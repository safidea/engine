import * as t from 'io-ts'
import { BaseFieldParams } from '../base/BaseFieldParams'

export const SingleLinkedRecordFieldParams = t.intersection([
  BaseFieldParams,
  t.type({
    type: t.literal('single_linked_record'),
    table: t.string,
  }),
])

export type SingleLinkedRecordFieldParams = t.TypeOf<typeof SingleLinkedRecordFieldParams>
