import * as t from 'io-ts'
import { BaseFieldParams } from '../base/BaseFieldParams'

export const SingleSelectFieldParams = t.intersection([
  BaseFieldParams,
  t.type({
    type: t.literal('single_select'),
    options: t.array(t.string),
  }),
])

export type SingleSelectFieldParams = t.TypeOf<typeof SingleSelectFieldParams>
