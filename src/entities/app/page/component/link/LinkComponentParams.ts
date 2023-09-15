import * as t from 'io-ts'

export const LinkComponentParams = t.type({
  type: t.literal('link'),
  path: t.string,
  label: t.string,
})

export type LinkComponentParams = t.TypeOf<typeof LinkComponentParams>
