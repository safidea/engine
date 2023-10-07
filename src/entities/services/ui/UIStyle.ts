import * as t from 'io-ts'

const Sizes = t.union([
  t.literal('none'),
  t.literal('extra-small'),
  t.literal('small'),
  t.literal('medium'),
  t.literal('large'),
  t.literal('extra-large'),
])

export const UIStyle = t.partial({
  items: t.literal('center'),
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
    align: t.union([t.literal('left'), t.literal('center'), t.literal('right')]),
  }),
  rounded: Sizes,
  shadow: Sizes,
})

export type UIStyle = t.TypeOf<typeof UIStyle>
