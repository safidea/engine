import { FilterOptions } from './filter/FilterOptions'
import { TableOptions } from '@entities/app/table/TableOptions'
import { RecordData } from './record/RecordData'
import { RecordUpdatedData } from './record/state/RecordToUpdate'

export interface DatabaseDriver {
  configure(tables: TableOptions[]): Promise<void>
  tableExists(tableName: string): boolean
  create(table: string, record: RecordData): Promise<string>
  createMany(table: string, records: RecordData[]): Promise<string[]>
  softUpdate(table: string, record: RecordUpdatedData): Promise<void>
  softUpdateMany(table: string, records: RecordUpdatedData[]): Promise<void>
  list(table: string, filters: FilterOptions[]): Promise<RecordData[]>
  read(table: string, id: string): Promise<RecordData | undefined>
}
