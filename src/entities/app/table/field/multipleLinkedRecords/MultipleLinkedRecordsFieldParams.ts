import * as t from 'io-ts'
import { BaseFieldParams } from '../base/BaseFieldParams'

export const MultipleLinkedRecordsFieldParams = t.intersection([
  BaseFieldParams,
  t.type({
    type: t.literal('multiple_linked_records'),
    table: t.string,
  }),
])

export type MultipleLinkedRecordsFieldParams = t.TypeOf<typeof MultipleLinkedRecordsFieldParams>
