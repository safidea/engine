import { Table } from '@entities/app/table/Table'
import { RecordToCreate } from './record/state/toCreate/RecordToCreate'
import { RecordToUpdate } from './record/state/toUpdate/RecordToUpdate'
import { Filter } from './filter/Filter'
import { PersistedRecord } from './record/state/persisted/PersistedRecord'
import { TableList } from '@entities/app/table/TableList'
import { RecordToDelete } from './record/state/toDelete/RecordToDelete'

export interface IDatabaseMapper {
  configure(tables: TableList): Promise<void>
  tableExists(table: string): Promise<boolean>
  create(table: Table, record: RecordToCreate): Promise<PersistedRecord>
  createMany(table: Table, records: RecordToCreate[]): Promise<PersistedRecord[]>
  softUpdate(table: Table, record: RecordToUpdate): Promise<PersistedRecord>
  softUpdateMany(table: Table, records: RecordToUpdate[]): Promise<PersistedRecord[]>
  softDelete(table: Table, record: RecordToDelete): Promise<PersistedRecord>
  softDeleteMany(table: Table, records: RecordToDelete[]): Promise<PersistedRecord[]>
  list(table: Table, filters: Filter[]): Promise<PersistedRecord[]>
  read(table: Table, id: string): Promise<PersistedRecord | undefined>
}
