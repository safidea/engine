import { Emit } from '@entities/app/automation/AutomationList'
import { Table } from '@entities/app/table/Table'
import { RecordToCreate } from './record/state/toCreate/RecordToCreate'
import { RecordToUpdate } from './record/state/toUpdate/RecordToUpdate'
import { Filter } from './filter/Filter'
import { PersistedRecord } from './record/state/persisted/PersistedRecord'
import { TableList } from '@entities/app/table/TableList'
import { RecordToDelete } from './record/state/toDelete/RecordToDelete'

export interface IDatabaseService {
  configure(tables: TableList): Promise<void>
  listen(emit: Emit): Promise<void>
  tableExists(table: string): Promise<boolean>
  create(table: Table, record: RecordToCreate): Promise<string>
  createMany(table: Table, records: RecordToCreate[]): Promise<string[]>
  softUpdate(table: Table, record: RecordToUpdate): Promise<void>
  softUpdateMany(table: Table, records: RecordToUpdate[]): Promise<void>
  softDelete(table: Table, record: RecordToDelete): Promise<void>
  softDeleteMany(table: Table, records: RecordToDelete[]): Promise<void>
  list(table: Table, filters: Filter[]): Promise<PersistedRecord[]>
  read(table: Table, id: string): Promise<PersistedRecord | undefined>
}
