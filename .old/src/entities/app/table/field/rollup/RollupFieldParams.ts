import * as t from 'io-ts'
import { BaseFieldParams } from '../base/BaseFieldParams'

export interface RollupFieldParams extends BaseFieldParams {
  readonly type: 'rollup'
  readonly linkedRecords: string
  readonly linkedField: string
  readonly formula: string
}

export const RollupFieldParams: t.Type<RollupFieldParams> = t.intersection([
  BaseFieldParams,
  t.type({
    type: t.literal('rollup'),
    linkedRecords: t.string,
    linkedField: t.string,
    formula: t.string,
  }),
])
