import * as t from 'io-ts'
import { BaseFieldParams } from '../base/BaseFieldParams'

export const UrlFieldParams = t.intersection([
  BaseFieldParams,
  t.type({
    type: t.literal('url'),
  }),
])

export type UrlFieldParams = t.TypeOf<typeof UrlFieldParams>
