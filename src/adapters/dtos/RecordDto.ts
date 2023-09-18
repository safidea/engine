import { PersistedRecordData } from '@entities/services/database/record/state/persisted/PersistedRecordData'
import { RecordToCreateData } from '@entities/services/database/record/state/toCreate/RecordToCreateData'
import { RecordToDeleteData } from '@entities/services/database/record/state/toDelete/RecordToDeleteData'
import { RecordToUpdateData } from '@entities/services/database/record/state/toUpdate/RecordToUpdateData'

export type PersistedRecordDto = PersistedRecordData
export const PersistedRecordDto = PersistedRecordData

export type RecordToUpdateDto = RecordToUpdateData
export const RecordToUpdateDto = RecordToUpdateData

export type RecordToCreateDto = RecordToCreateData
export const RecordToCreateDto = RecordToCreateData

export type RecordToDeleteDto = RecordToDeleteData
export const RecordToDeleteDto = RecordToDeleteData
