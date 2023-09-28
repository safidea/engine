import * as t from 'io-ts'

export const ImageComponentParams = t.intersection([
  t.type({
    type: t.literal('image'),
    url: t.string,
    text: t.string,
  }),
  t.partial({
    width: t.number,
  }),
])

export type ImageComponentParams = t.TypeOf<typeof ImageComponentParams>
