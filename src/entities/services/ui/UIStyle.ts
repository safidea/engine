import * as t from 'io-ts'

export const UIStyle = t.partial({
  items: t.literal('center'),
  background: t.partial({
    color: t.literal('gray-100'),
  }),
})

export type UIStyle = t.TypeOf<typeof UIStyle>
