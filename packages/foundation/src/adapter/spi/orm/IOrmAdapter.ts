import { TableDto } from '@adapter/api/table/dtos/TableDto'
import { RecordDto } from '@adapter/spi/orm/dtos/RecordDto'
import { FilterDto } from './dtos/FilterDto'

export interface IOrmAdapter {
  configure(tables: TableDto[]): Promise<void>
  tableExists(tableName: string): boolean
  create(table: string, record: RecordDto): Promise<string>
  createMany(table: string, record: RecordDto[]): Promise<string[]>
  softUpdateById(table: string, record: RecordDto, id: string): Promise<void>
  softUpdateMany(table: string, records: RecordDto[]): Promise<void>
  list(table: string, filters: FilterDto[]): Promise<RecordDto[]>
  readById(table: string, id: string): Promise<RecordDto | undefined>
}
