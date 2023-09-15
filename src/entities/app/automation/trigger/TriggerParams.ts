import * as t from 'io-ts'
import { RecordCreatedTriggerParams } from './database/recordCreated/RecordCreatedTriggerParams'
import { RecordUpdatedTriggerParams } from './database/recordUpdated/RecordUpdatedTriggerParams'
import { ServerStartedTriggerParams } from './server/serverStarted/ServerStartedTriggerParams'
import { ServerStoppedTriggerParams } from './server/serverStopped/ServerStoppedTriggerParams'

export const TriggerParams = t.union([
  RecordCreatedTriggerParams,
  RecordUpdatedTriggerParams,
  ServerStartedTriggerParams,
  ServerStoppedTriggerParams,
])

export type TriggerParams = t.TypeOf<typeof TriggerParams>