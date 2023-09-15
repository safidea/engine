import * as t from 'io-ts'
import { BaseFieldParams } from '../base/BaseFieldParams'

export const AutonumberFieldParams = t.intersection([
  BaseFieldParams,
  t.type({
    type: t.literal('autonumber'),
  }),
])

export type AutonumberFieldParams = t.TypeOf<typeof AutonumberFieldParams>
