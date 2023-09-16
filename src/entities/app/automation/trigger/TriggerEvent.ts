import { RecordCreatedTriggerEvent } from './database/recordCreated/RecordCreatedTriggerEvent'
import { RecordUpdatedTriggerEvent } from './database/recordUpdated/RecordUpdatedTriggerEvent'

export type TriggerEvent = RecordCreatedTriggerEvent | RecordUpdatedTriggerEvent
