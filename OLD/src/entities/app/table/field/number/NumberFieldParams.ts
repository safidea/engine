import * as t from 'io-ts'
import { BaseFieldParams } from '../base/BaseFieldParams'

export interface NumberFieldParams extends BaseFieldParams {
  readonly type: 'number'
}

export const NumberFieldParams: t.Type<NumberFieldParams> = t.intersection([
  BaseFieldParams,
  t.type({
    type: t.literal('number'),
  }),
])
