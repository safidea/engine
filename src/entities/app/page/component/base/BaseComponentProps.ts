import { UpdateRecord, AddRecord, RemoveRecord } from '../form/FormComponentUI'
import { Record } from '@entities/services/database/record/Record'

export interface BaseComponentProps {
  updateRecord?: UpdateRecord
  addRecord?: AddRecord
  removeRecord?: RemoveRecord
  currentRecord?: Record
  records?: Record[]
}
