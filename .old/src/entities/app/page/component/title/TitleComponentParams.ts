import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

export type TitleSize = 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large'

export const TitleSize: t.Type<TitleSize> = t.union([
  t.literal('extra-small'),
  t.literal('small'),
  t.literal('medium'),
  t.literal('large'),
  t.literal('extra-large'),
])

export interface TitleComponentParams extends BaseComponentParams {
  readonly type: 'title'
  readonly text: string
  readonly size?: TitleSize
  readonly style?: {
    readonly title?: UIStyle
  }
}

export const TitleComponentParams: t.Type<TitleComponentParams> = t.intersection([
  BaseComponentParams,
  t.type({
    type: t.literal('title'),
    text: t.string,
  }),
  t.partial({
    size: TitleSize,
    style: t.partial({
      title: UIStyle,
    }),
  }),
])
