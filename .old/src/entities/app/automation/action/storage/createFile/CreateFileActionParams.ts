import * as t from 'io-ts'

export type CreateFileActionParams = {
  readonly name: string
  readonly type: 'create_file'
  readonly filename: string
  readonly input: 'html'
  readonly output: 'pdf'
  readonly template: string | { readonly path: string }
  readonly bucket: string
  readonly data: { [key: string]: string }
}

export const CreateFileActionParams: t.Type<CreateFileActionParams> = t.type({
  name: t.string,
  type: t.literal('create_file'),
  filename: t.string,
  input: t.literal('html'),
  output: t.literal('pdf'),
  template: t.union([t.string, t.type({ path: t.string })]),
  bucket: t.string,
  data: t.record(t.string, t.string),
})
