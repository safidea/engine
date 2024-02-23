import * as t from 'io-ts'
import { RecordCreatedTriggerParams } from './database/recordCreated/RecordCreatedTriggerParams'
import { RecordUpdatedTriggerParams } from './database/recordUpdated/RecordUpdatedTriggerParams'

export type TriggerParams = RecordCreatedTriggerParams | RecordUpdatedTriggerParams

export const TriggerParams: t.Type<TriggerParams> = t.union([
  RecordCreatedTriggerParams,
  RecordUpdatedTriggerParams,
])
