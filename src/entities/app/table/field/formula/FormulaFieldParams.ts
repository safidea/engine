import * as t from 'io-ts'
import { BaseFieldParams } from '../base/BaseFieldParams'

export const FormulaFieldParams = t.intersection([
  BaseFieldParams,
  t.type({
    type: t.literal('formula'),
    formula: t.string,
  }),
])

export type FormulaFieldParams = t.TypeOf<typeof FormulaFieldParams>
