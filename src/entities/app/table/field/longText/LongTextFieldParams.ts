import * as t from 'io-ts'
import { BaseFieldParams } from '../base/BaseFieldParams'

export interface LongTextFieldParams extends BaseFieldParams {
  readonly type: 'long_text'
}

export const LongTextFieldParams: t.Type<LongTextFieldParams> = t.intersection([
  BaseFieldParams,
  t.type({
    type: t.literal('long_text'),
  }),
])
