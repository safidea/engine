import * as t from 'io-ts'

export type ContextParams = {
  readonly path: {
    readonly params: {
      readonly [key: string]: string
    }
  }
}

export const ContextParams: t.Type<ContextParams> = t.type({
  path: t.type({
    params: t.record(t.string, t.string),
  }),
})
