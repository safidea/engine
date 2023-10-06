import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

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
    icon: t.intersection([
      t.type({
        name: t.string,
      }),
      t.partial({
        style: t.partial({
          icon: UIStyle,
        }),
      }),
    ]),
    style: t.partial({
      paragraph: UIStyle,
    }),
  }),
])

export type ParagraphComponentParams = t.TypeOf<typeof ParagraphComponentParams>
