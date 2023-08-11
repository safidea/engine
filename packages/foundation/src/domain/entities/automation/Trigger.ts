import { ServerStartedTrigger } from './triggers/ServerStartedTrigger'
import { RecordCreatedTrigger } from './triggers/RecordCreatedTrigger'
import { ServerStoppedTrigger } from './triggers/ServerStoppedTrigger'

export type Trigger = RecordCreatedTrigger | ServerStartedTrigger | ServerStoppedTrigger
