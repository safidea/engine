import { InMemoryOrm } from '@infrastructure/orm/InMemoryOrm'
import { Table } from '@domain/entities/Table'
import { RecordToCreateDto } from '@application/dtos/RecordDto'

export class Database {
  private orm: InMemoryOrm
  private tables: Table[] = []

  constructor(folder: string) {
    this.orm = new InMemoryOrm(folder)
  }

  configure(tables: Table[]): void {
    this.tables = tables
    this.orm.configure(tables)
  }

  list(table: string) {
    return this.orm.list(table)
  }

  createRecord(table: string, record: RecordToCreateDto) {
    return this.orm.create(table, record as any)
  }

  createManyRecords(table: string, records: RecordToCreateDto[]) {
    return this.orm.createMany(table, records as any)
  }
}
