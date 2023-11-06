import * as t from 'io-ts'
import { BaseFieldParams } from '../base/BaseFieldParams'

export interface DatetimeFieldParams extends BaseFieldParams {
  readonly type: 'datetime'
}

export const DatetimeFieldParams: t.Type<DatetimeFieldParams> = t.intersection([
  BaseFieldParams,
  t.type({
    type: t.literal('datetime'),
  }),
])
