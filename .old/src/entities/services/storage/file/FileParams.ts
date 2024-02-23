import * as t from 'io-ts'

export type FileParams = {
  readonly filename: string
  readonly extension?: string
  readonly mimetype?: string
  readonly path?: string
}

export const FileParams: t.Type<FileParams> = t.intersection([
  t.type({
    filename: t.string,
  }),
  t.partial({
    extension: t.string,
    mimetype: t.string,
    path: t.string,
  }),
])
