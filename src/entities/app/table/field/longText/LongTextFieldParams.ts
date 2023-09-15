import * as t from 'io-ts'
import { BaseFieldParams } from '../base/BaseFieldParams'

export const LongTextFieldParams = t.intersection([
  BaseFieldParams,
  t.type({
    type: t.literal('long_text'),
  }),
])

export type LongTextFieldParams = t.TypeOf<typeof LongTextFieldParams>
