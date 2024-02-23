import { PersistedRecord } from './state/persisted/PersistedRecord'
import { RecordToCreate } from './state/toCreate/RecordToCreate'
import { RecordToDelete } from './state/toDelete/RecordToDelete'
import { RecordToUpdate } from './state/toUpdate/RecordToUpdate'

export type Record = PersistedRecord | RecordToCreate | RecordToUpdate | RecordToDelete

export type RecordToPersite = RecordToCreate | RecordToUpdate | RecordToDelete
