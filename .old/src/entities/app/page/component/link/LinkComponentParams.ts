import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'
import { IconSize } from '../icon/IconComponentParams'

export type LinkIconPosition = 'left' | 'right'

export const LinkIconPosition: t.Type<LinkIconPosition> = t.union([
  t.literal('left'),
  t.literal('right'),
])

export type LinkSize = 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large'

export const LinkSize: t.Type<LinkSize> = t.union([
  t.literal('extra-small'),
  t.literal('small'),
  t.literal('medium'),
  t.literal('large'),
  t.literal('extra-large'),
])

export type LinkDisplay = 'primary-button' | 'secondary-button' | 'link'

export const LinkDisplay: t.Type<LinkDisplay> = t.union([
  t.literal('primary-button'),
  t.literal('secondary-button'),
  t.literal('link'),
])

export interface LinkComponentParams extends BaseComponentParams {
  readonly type: 'link'
  readonly path: string
  readonly text: string
  readonly size?: LinkSize
  readonly display?: LinkDisplay
  readonly icon?: {
    readonly name: string
    readonly size?: IconSize
    readonly position?: LinkIconPosition
    readonly style?: {
      readonly icon?: UIStyle
    }
  }
  readonly style?: {
    readonly link?: UIStyle
  }
}

export const LinkComponentParams: t.Type<LinkComponentParams> = t.intersection([
  BaseComponentParams,
  t.type({
    type: t.literal('link'),
    path: t.string,
    text: t.string,
  }),
  t.partial({
    size: LinkSize,
    display: LinkDisplay,
    icon: t.intersection([
      t.type({
        name: t.string,
      }),
      t.partial({
        size: IconSize,
        position: LinkIconPosition,
        style: t.partial({
          icon: UIStyle,
        }),
      }),
    ]),
    style: t.partial({
      link: UIStyle,
    }),
  }),
])
