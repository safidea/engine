import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'

export const IconComponentParams = t.intersection([
  BaseComponentParams,
  t.type({
    type: t.literal('icon'),
    name: t.string,
  }),
  t.partial({
    size: t.number,
  }),
])

export type IconComponentParams = t.TypeOf<typeof IconComponentParams>
