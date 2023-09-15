import { RecordData } from '@entities/drivers/database/record/state/base/BaseRecordData'
import { RecordDeletedData } from '@entities/drivers/database/record/state/toDelete/RecordToDelete'
import { RecordUpdatedData } from '@entities/drivers/database/record/state/toUpdate/RecordToUpdate'

export interface CommandSync {
  type: 'toCreate' | 'toUpdate' | 'toDelete'
  table: string
  record: RecordData | RecordUpdatedData | RecordDeletedData
}
