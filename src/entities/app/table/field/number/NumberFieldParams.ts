import * as t from 'io-ts'
import { BaseFieldParams } from '../base/BaseFieldParams'

export const NumberFieldParams = t.intersection([
  BaseFieldParams,
  t.type({
    type: t.literal('number'),
  }),
])

export type NumberFieldParams = t.TypeOf<typeof NumberFieldParams>
