import * as t from 'io-ts'

export const LogActionParams = t.type({
  name: t.string,
  type: t.literal('log'),
  message: t.string,
})

export type LogActionParams = t.TypeOf<typeof LogActionParams>
