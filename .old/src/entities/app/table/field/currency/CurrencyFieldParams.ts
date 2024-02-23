import * as t from 'io-ts'
import { BaseFieldParams } from '../base/BaseFieldParams'

export interface CurrencyFieldParams extends BaseFieldParams {
  readonly type: 'currency'
}

export const CurrencyFieldParams: t.Type<CurrencyFieldParams> = t.intersection([
  BaseFieldParams,
  t.type({
    type: t.literal('currency'),
  }),
])
