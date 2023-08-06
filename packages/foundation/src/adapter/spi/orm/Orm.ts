import { TableDto } from '@adapter/api/table/dtos/TableDto'
import { RecordDto } from './dtos/RecordDto'
import { FilterDto } from './dtos/FilterDto'

export interface Orm {
  configure(tables: TableDto[]): void
  tableExists(tableName: string): boolean
  create(table: string, record: RecordDto): Promise<string>
  createMany(table: string, record: RecordDto[]): Promise<string[]>
  softUpdateById(table: string, record: RecordDto, id: string): Promise<void>
  list(table: string, filters: FilterDto[]): Promise<RecordDto[]>
  readById(table: string, id: string): Promise<RecordDto | undefined>
}
