import * as t from 'io-ts'

export const TitleSize = t.union([
  t.literal('extra-small'),
  t.literal('small'),
  t.literal('medium'),
  t.literal('large'),
  t.literal('extra-large'),
])

export type TitleSize = t.TypeOf<typeof TitleSize>

export const TitleComponentParams = t.type({
  type: t.literal('title'),
  text: t.string,
  size: TitleSize,
})

export type TitleComponentParams = t.TypeOf<typeof TitleComponentParams>
