import { DataDto } from '@application/dtos/DataDto'
import { RecordDto } from '@application/dtos/RecordDto'
import { TableDto } from '@application/dtos/TableDto'

export interface IOrmRepository {
  configure(tables: TableDto[]): void
  create(table: string, body: DataDto): Promise<string>
  createMany(table: string, body: DataDto[]): Promise<string[]>
  list(table: string): Promise<RecordDto[]>
  readById(table: string, id: string): Promise<RecordDto>
}
