import * as t from 'io-ts'

export const ServerStoppedTriggerParams = t.type({
  event: t.literal('server_stopped'),
})

export type ServerStoppedTriggerParams = t.TypeOf<typeof ServerStoppedTriggerParams>
