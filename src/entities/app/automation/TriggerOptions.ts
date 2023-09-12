import { RecordCreatedTriggerOptions } from './triggers/RecordCreatedTriggerOptions'
import { RecordUpdatedTriggerOptions } from './triggers/RecordUpdatedTriggerOptions'
import { ServerStartedTriggerOptions } from './triggers/ServerStartedTriggerOptions'
import { ServerStoppedTriggerOptions } from './triggers/ServerStoppedTriggerOptions'

export type TriggerOptions =
  | RecordCreatedTriggerOptions
  | RecordUpdatedTriggerOptions
  | ServerStartedTriggerOptions
  | ServerStoppedTriggerOptions
