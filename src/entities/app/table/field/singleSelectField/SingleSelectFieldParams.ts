import * as t from 'io-ts'
import { BaseFieldParams } from '../base/BaseFieldParams'

export interface SingleSelectFieldParams extends BaseFieldParams {
  readonly type: 'single_select'
  readonly options: ReadonlyArray<string>
}

export const SingleSelectFieldParams: t.Type<SingleSelectFieldParams> = t.intersection([
  BaseFieldParams,
  t.type({
    type: t.literal('single_select'),
    options: t.array(t.string),
  }),
])
