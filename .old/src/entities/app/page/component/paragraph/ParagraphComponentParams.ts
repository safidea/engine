import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

export type ParagraphSize = 'small' | 'medium' | 'large'

export const ParagraphSize: t.Type<ParagraphSize> = t.union([
  t.literal('small'),
  t.literal('medium'),
  t.literal('large'),
])

export interface ParagraphComponentParams extends BaseComponentParams {
  readonly type: 'paragraph'
  readonly text: string
  readonly size?: ParagraphSize
  readonly icon?: {
    readonly name: string
    readonly style?: {
      readonly icon?: UIStyle
    }
  }
  readonly style?: {
    readonly paragraph?: UIStyle
  }
}

export const ParagraphComponentParams: t.Type<ParagraphComponentParams> = t.intersection([
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
