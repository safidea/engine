import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'
import { IconSize } from '../icon/IconComponentParams'

export const LinkIconPosition = t.union([t.literal('left'), t.literal('right')])

export type LinkIconPosition = t.TypeOf<typeof LinkIconPosition>

export const LinkSize = t.union([
  t.literal('extra-small'),
  t.literal('small'),
  t.literal('medium'),
  t.literal('large'),
  t.literal('extra-large'),
])

export type LinkSize = t.TypeOf<typeof LinkSize>

export const LinkDisplay = t.union([
  t.literal('primary-button'),
  t.literal('secondary-button'),
  t.literal('link'),
])

export type LinkDisplay = t.TypeOf<typeof LinkDisplay>

export const LinkComponentParams = t.intersection([
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

export type LinkComponentParams = t.TypeOf<typeof LinkComponentParams>
