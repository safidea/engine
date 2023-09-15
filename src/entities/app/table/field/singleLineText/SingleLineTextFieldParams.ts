import * as t from 'io-ts'
import { BaseFieldParams } from '../base/BaseFieldParams'

export const SingleLineTextFieldParams = t.intersection([
  BaseFieldParams,
  t.type({
    type: t.literal('single_line_text'),
  }),
])

export type SingleLineTextFieldParams = t.TypeOf<typeof SingleLineTextFieldParams>
