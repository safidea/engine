import { DatabaseTable, type DatabaseTableSpi } from './DatabaseTable'

export interface DatabaseSpi {
  table: (name: string) => DatabaseTableSpi
}

export class Database {
  constructor(private spi: DatabaseSpi) {}

  table(name: string) {
    return new DatabaseTable(this.spi, name)
  }

  disconnect = async () => {}
}
