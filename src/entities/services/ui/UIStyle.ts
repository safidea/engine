import * as t from 'io-ts'

export type Sizes = 'none' | 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large'

const Sizes: t.Type<Sizes> = t.union([
  t.literal('none'),
  t.literal('extra-small'),
  t.literal('small'),
  t.literal('medium'),
  t.literal('large'),
  t.literal('extra-large'),
])

export type HorizontalPositions = 'left' | 'center' | 'right'

const HorizontalPositions: t.Type<HorizontalPositions> = t.union([
  t.literal('left'),
  t.literal('center'),
  t.literal('right'),
])

export type UIStyle = {
  readonly items?: HorizontalPositions
  readonly background?: {
    readonly color?: 'gray-100'
  }
  readonly margin?: {
    readonly top?: Sizes
    readonly right?: Sizes
    readonly bottom?: Sizes
    readonly left?: Sizes
  }
  readonly text?: {
    readonly align?: HorizontalPositions
  }
  readonly rounded?: Sizes
  readonly shadow?: Sizes
  readonly content?: {
    readonly justify?: HorizontalPositions
  }
}

export const UIStyle: t.Type<UIStyle> = t.partial({
  items: HorizontalPositions,
  background: t.partial({
    color: t.literal('gray-100'),
  }),
  margin: t.partial({
    top: Sizes,
    right: Sizes,
    bottom: Sizes,
    left: Sizes,
  }),
  text: t.partial({
    align: HorizontalPositions,
  }),
  rounded: Sizes,
  shadow: Sizes,
  content: t.partial({
    justify: HorizontalPositions,
  }),
})
