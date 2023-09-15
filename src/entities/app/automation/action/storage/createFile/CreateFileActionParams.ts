import * as t from 'io-ts'

export const CreateFileActionParams = t.type({
  name: t.string,
  type: t.literal('create_file'),
  filename: t.string,
  input: t.literal('html'),
  output: t.literal('pdf'),
  template: t.union([t.string, t.type({ path: t.string })]),
  bucket: t.string,
  data: t.record(t.string, t.string),
})

export type CreateFileActionParams = t.TypeOf<typeof CreateFileActionParams>