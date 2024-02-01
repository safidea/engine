import { DatabaseTable, type DatabaseTableSPI } from './DatabaseTable'

export interface DatabaseSPI {
  table: (name: string) => DatabaseTableSPI
}

export class Database {
  constructor(private spi: DatabaseSPI) {}

  table(name: string) {
    return new DatabaseTable(this.spi, name)
  }
}
