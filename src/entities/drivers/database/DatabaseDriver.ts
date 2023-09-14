import { TableOptions } from '@adapters/api/table/dtos/TableDto'
import { RecordOptions } from '@adapters/spi/orm/dtos/RecordDto'
import { FilterOptions } from './filter/FilterOptions'

export interface DatabaseDriver {
  configure(tables: TableOptions[]): Promise<void>
  tableExists(tableName: string): boolean
  create(table: string, record: RecordDto): Promise<string>
  createMany(table: string, record: RecordDto[]): Promise<string[]>
  softUpdateById(table: string, record: RecordDto, id: string): Promise<void>
  softUpdateMany(table: string, records: RecordDto[]): Promise<void>
  list(table: string, filters: FilterDto[]): Promise<RecordDto[]>
  readById(table: string, id: string): Promise<RecordDto | undefined>
}
