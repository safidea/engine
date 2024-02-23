import * as t from 'io-ts'
import { BaseFieldParams } from '../base/BaseFieldParams'

export interface AutonumberFieldParams extends BaseFieldParams {
  readonly type: 'autonumber'
}

export const AutonumberFieldParams: t.Type<AutonumberFieldParams> = t.intersection([
  BaseFieldParams,
  t.type({
    type: t.literal('autonumber'),
  }),
])
