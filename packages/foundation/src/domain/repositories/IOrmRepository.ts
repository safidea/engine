import { DataDto } from '@application/dtos/DataDto'
import { RecordDto } from '@application/dtos/RecordDto'

export interface IOrmRepository {
  create(table: string, body: DataDto): Promise<RecordDto>
  createMany(table: string, body: DataDto[]): Promise<RecordDto[]>
  list(table: string): Promise<RecordDto[]>
  readById(table: string, id: string): Promise<RecordDto>
}
