import * as t from 'io-ts'

export const BaseComponentParams = t.intersection([
  t.type({
    type: t.string,
  }),
  t.partial({
    testId: t.string,
  }),
])

export type BaseComponentParams = t.TypeOf<typeof BaseComponentParams>
