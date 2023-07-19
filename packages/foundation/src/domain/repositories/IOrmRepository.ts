import { DataDto } from '@application/dtos/DataDto'
import { FilterDto } from '@application/dtos/FilterDto'
import { RecordDto } from '@application/dtos/RecordDto'
import { TableDto } from '@application/dtos/TableDto'

export interface IOrmRepository {
  configure(tables: TableDto[]): void
  create(table: string, body: DataDto): Promise<string>
  createMany(table: string, body: DataDto[]): Promise<string[]>
  list(table: string, filters?: FilterDto[]): Promise<RecordDto[]>
  readById(table: string, id: string): Promise<RecordDto>
}
