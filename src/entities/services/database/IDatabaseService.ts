import { Emit } from '@entities/app/automation/AutomationList'
import { Table } from '@entities/app/table/Table'
import { TableParams } from '@entities/app/table/TableParams'
import { RecordToCreate } from './record/state/toCreate/RecordToCreate'
import { RecordToUpdate } from './record/state/toUpdate/RecordToUpdate'
import { Filter } from './filter/Filter'
import { PersistedRecord } from './record/state/persisted/PersistedRecord'

export interface IDatabaseService {
  configure(tables: TableParams[]): Promise<void>
  listen(emit: Emit): Promise<void>
  tableExists(table: string): Promise<boolean>
  create(table: Table, record: RecordToCreate): Promise<string>
  createMany(table: Table, records: RecordToCreate[]): Promise<string[]>
  update(table: Table, record: RecordToUpdate): Promise<void>
  updateMany(table: Table, records: RecordToUpdate[]): Promise<void>
  list(table: Table, filters: Filter[]): Promise<PersistedRecord[]>
  read(table: Table, id: string): Promise<PersistedRecord | undefined>
}
