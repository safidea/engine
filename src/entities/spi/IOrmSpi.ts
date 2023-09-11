import { Filter } from '@entities/orm/Filter'
import { Record } from '@entities/orm/Record'
import { Table } from '@entities/app/table/Table'

export interface IOrmSpi {
  configure(tables: Table[]): Promise<void>
  tableExists(table: string): Promise<boolean>
  create(table: string, record: Record): Promise<string>
  createMany(table: string, record: Record[]): Promise<string[]>
  read(table: string, id: string): Promise<Record | undefined>
  list(table: string, filters: Filter[]): Promise<Record[]>
  update(table: string, record: Record, id: string): Promise<void>
  updateMany(table: string, records: Record[]): Promise<void>
}
