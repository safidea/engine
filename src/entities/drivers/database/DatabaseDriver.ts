import { FilterParams } from './filter/FilterParams'
import { TableParams } from '@entities/app/table/TableParams'
import { RecordData } from './record/RecordData'
import { RecordToUpdateData } from './record/state/toUpdate/RecordToUpdateData'

export interface DatabaseDriver {
  configure(tables: TableParams[]): Promise<void>
  tableExists(tableName: string): boolean
  create(table: string, record: RecordData): Promise<string>
  createMany(table: string, records: RecordData[]): Promise<string[]>
  softUpdate(table: string, record: RecordToUpdateData): Promise<void>
  softUpdateMany(table: string, records: RecordToUpdateData[]): Promise<void>
  list(table: string, filters: FilterParams[]): Promise<RecordData[]>
  read(table: string, id: string): Promise<RecordData | undefined>
}
