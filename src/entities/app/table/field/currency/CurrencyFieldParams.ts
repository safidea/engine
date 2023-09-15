import * as t from 'io-ts'
import { BaseFieldParams } from '../base/BaseFieldParams'

export const CurrencyFieldParams = t.intersection([
  BaseFieldParams,
  t.type({
    type: t.literal('currency'),
  }),
])

export type CurrencyFieldParams = t.TypeOf<typeof CurrencyFieldParams>
