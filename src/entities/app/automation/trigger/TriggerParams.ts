import * as t from 'io-ts'
import { RecordCreatedTriggerParams } from './database/recordCreated/RecordCreatedTriggerParams'
import { RecordUpdatedTriggerParams } from './database/recordUpdated/RecordUpdatedTriggerParams'

export const TriggerParams = t.union([RecordCreatedTriggerParams, RecordUpdatedTriggerParams])

export type TriggerParams = t.TypeOf<typeof TriggerParams>
