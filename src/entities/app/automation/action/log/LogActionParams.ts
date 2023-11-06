import * as t from 'io-ts'

export type LogActionParams = {
  readonly name: string
  readonly type: 'log'
  readonly message: string
}

export const LogActionParams: t.Type<LogActionParams> = t.type({
  name: t.string,
  type: t.literal('log'),
  message: t.string,
})
