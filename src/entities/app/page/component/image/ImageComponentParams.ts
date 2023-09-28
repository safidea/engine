import * as t from 'io-ts'

export const ImageComponentParams = t.type({
  type: t.literal('image'),
  url: t.string,
  text: t.string,
})

export type ImageComponentParams = t.TypeOf<typeof ImageComponentParams>
