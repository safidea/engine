import { RecordCreatedTriggerOptions } from './database/recordCreated/RecordCreatedTriggerOptions'
import { RecordUpdatedTriggerOptions } from './database/recordUpdated/RecordUpdatedTriggerOptions'
import { ServerStartedTriggerOptions } from './server/serverStarted/ServerStartedTriggerOptions'
import { ServerStoppedTriggerOptions } from './server/serverStopped/ServerStoppedTriggerOptions'

export type TriggerOptions =
  | RecordCreatedTriggerOptions
  | RecordUpdatedTriggerOptions
  | ServerStartedTriggerOptions
  | ServerStoppedTriggerOptions
