import * as t from 'io-ts'

export const FileParams = t.intersection([
  t.type({
    filename: t.string,
  }),
  t.partial({
    extension: t.string,
    mimetype: t.string,
    path: t.string,
  }),
])

export type FileParams = t.TypeOf<typeof FileParams>
