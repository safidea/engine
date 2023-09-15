import * as t from 'io-ts'
import { BaseFieldParams } from '../base/BaseFieldParams'

export const RollupFieldParams = t.intersection([
  BaseFieldParams,
  t.type({
    type: t.literal('rollup'),
    linkedRecords: t.string,
    linkedField: t.string,
    formula: t.string,
  }),
])

export type RollupFieldParams = t.TypeOf<typeof RollupFieldParams>
