import { FilterParams } from '../../../entities/services/database/filter/FilterParams'
import { TableParams } from '@entities/app/table/TableParams'
import { RecordData } from '../../../entities/services/database/record/RecordData'
import { RecordToUpdateData } from '../../../entities/services/database/record/state/toUpdate/RecordToUpdateData'
import { RecordToDeleteData } from '@entities/services/database/record/state/toDelete/RecordToDeleteData'

export interface IDatabaseDriver {
  configure(tables: TableParams[]): Promise<void>
  tableExists(tableName: string): boolean
  create(table: string, record: RecordData): Promise<string>
  createMany(table: string, records: RecordData[]): Promise<string[]>
  update(table: string, record: RecordToUpdateData | RecordToDeleteData): Promise<void>
  updateMany(table: string, records: RecordToUpdateData[] | RecordToDeleteData[]): Promise<void>
  list(table: string, filters: FilterParams[]): Promise<RecordData[]>
  read(table: string, id: string): Promise<RecordData | undefined>
}
