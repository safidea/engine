import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'

export const ButtonComponentParams = t.intersection([
  BaseComponentParams,
  t.type({
    type: t.literal('button'),
    text: t.string,
  }),
])

export type ButtonComponentParams = t.TypeOf<typeof ButtonComponentParams>
