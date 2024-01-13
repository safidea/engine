import * as t from 'io-ts'
import { BaseFieldParams } from '../base/BaseFieldParams'

export interface FormulaFieldParams extends BaseFieldParams {
  readonly type: 'formula'
  readonly formula: string
}

export const FormulaFieldParams: t.Type<FormulaFieldParams> = t.intersection([
  BaseFieldParams,
  t.type({
    type: t.literal('formula'),
    formula: t.string,
  }),
])
