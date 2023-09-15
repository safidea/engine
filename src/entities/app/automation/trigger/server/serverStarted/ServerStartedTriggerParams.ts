import * as t from 'io-ts'

export const ServerStartedTriggerParams = t.type({
  event: t.literal('server_started'),
})

export type ServerStartedTriggerParams = t.TypeOf<typeof ServerStartedTriggerParams>
