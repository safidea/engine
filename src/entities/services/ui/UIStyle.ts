import * as t from 'io-ts'

const SpacingSize = t.union([
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
    top: SpacingSize,
    right: SpacingSize,
    bottom: SpacingSize,
    left: SpacingSize,
  }),
})

export type UIStyle = t.TypeOf<typeof UIStyle>
