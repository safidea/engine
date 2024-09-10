import { PersistedRecord } from './Persisted'
import { CreatedRecord } from './Created'
import { UpdatedRecord } from './Updated'

export type Record = CreatedRecord | PersistedRecord | UpdatedRecord
