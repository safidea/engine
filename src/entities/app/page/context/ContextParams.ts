import * as t from 'io-ts'

export const ContextParams = t.type({
  path: t.type({
    params: t.record(t.string, t.string),
  }),
})

export type ContextParams = t.TypeOf<typeof ContextParams>
