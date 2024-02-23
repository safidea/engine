import * as t from 'io-ts'

export type BaseComponentParams = {
  readonly type: string
  readonly testId?: string
}

export const BaseComponentParams: t.Type<BaseComponentParams> = t.intersection([
  t.type({
    type: t.string,
  }),
  t.partial({
    testId: t.string,
  }),
])
