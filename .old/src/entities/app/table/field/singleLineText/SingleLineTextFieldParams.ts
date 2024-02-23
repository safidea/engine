import * as t from 'io-ts'
import { BaseFieldParams } from '../base/BaseFieldParams'

export interface SingleLineTextFieldParams extends BaseFieldParams {
  readonly type: 'single_line_text'
}

export const SingleLineTextFieldParams: t.Type<SingleLineTextFieldParams> = t.intersection([
  BaseFieldParams,
  t.type({
    type: t.literal('single_line_text'),
  }),
])
