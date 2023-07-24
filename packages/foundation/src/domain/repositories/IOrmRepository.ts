import { Table } from '@domain/entities/Table'
import { Filter } from '@domain/entities/Filter'
import { Record } from '@domain/entities/Record'

export interface IOrmRepository {
  configure(tables: Table[]): void
  create(table: string, record: Record): Promise<string>
  createMany(table: string, record: Record[]): Promise<string[]>
  softUpdateById(table: string, record: Record, id: string): Promise<void>
  list(table: string, filters?: Filter[]): Promise<Record[]>
  readById(table: string, id: string): Promise<Record>
}
