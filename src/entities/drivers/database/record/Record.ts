import { PersistedRecord } from './state/PersistedRecord'
import { RecordToCreate } from './state/RecordToCreate'
import { RecordToDelete } from './state/RecordToDelete'
import { RecordToUpdate } from './state/RecordToUpdate'

export type Record = PersistedRecord | RecordToCreate | RecordToUpdate | RecordToDelete