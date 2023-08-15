import { ServerStartedTrigger } from './triggers/ServerStartedTrigger'
import { RecordCreatedTrigger } from './triggers/RecordCreatedTrigger'
import { ServerStoppedTrigger } from './triggers/ServerStoppedTrigger'
import { RecordUpdatedTrigger } from './triggers/RecordUpdatedTrigger'

export type Trigger =
  | RecordCreatedTrigger
  | RecordUpdatedTrigger
  | ServerStartedTrigger
  | ServerStoppedTrigger
