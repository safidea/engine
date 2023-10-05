import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'

export const ParagraphSize = t.union([t.literal('small'), t.literal('medium'), t.literal('large')])

export type ParagraphSize = t.TypeOf<typeof ParagraphSize>

export const ParagraphComponentParams = t.intersection([
  BaseComponentParams,
  t.type({
    type: t.literal('paragraph'),
    text: t.string,
  }),
  t.partial({
    size: ParagraphSize,
    icon: t.type({
      name: t.string,
    }),
  }),
])

export type ParagraphComponentParams = t.TypeOf<typeof ParagraphComponentParams>
