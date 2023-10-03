import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'

export const LinkComponentParams = t.intersection([
  BaseComponentParams,
  t.type({
    type: t.literal('link'),
    path: t.string,
    text: t.string,
  }),
  t.partial({
    display: t.literal('primary-button'),
  }),
])

export type LinkComponentParams = t.TypeOf<typeof LinkComponentParams>
