import { Table } from '@domain/entities/table/Table'
import { Filter } from '@domain/entities/table/Filter'
import { Record } from '@domain/entities/table/Record'

export interface IOrmGateway {
  configure(tables: Table[]): void
  tableExists(tableName: string): boolean
  create(table: string, record: Record): Promise<string>
  createMany(table: string, record: Record[]): Promise<string[]>
  softUpdateById(table: string, record: Record, id: string): Promise<void>
  list(table: string, filters: Filter[]): Promise<Record[]>
  readById(table: string, id: string): Promise<Record | undefined>
}
