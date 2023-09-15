import * as t from 'io-ts'
import { BaseFieldParams } from '../base/BaseFieldParams'

export const DatetimeFieldParams = t.intersection([
  BaseFieldParams,
  t.type({
    type: t.literal('datetime'),
  }),
])

export type DatetimeFieldParams = t.TypeOf<typeof DatetimeFieldParams>
