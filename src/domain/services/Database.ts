import type { Table } from '@domain/entities/table/Table'
import { DatabaseTable, type DatabaseTableSpi } from './DatabaseTable'

export interface DatabaseSpi {
  table: (name: string) => DatabaseTableSpi
  disconnect: () => Promise<void>
}

export class Database {
  constructor(private spi: DatabaseSpi) {}

  table(name: string) {
    return new DatabaseTable(this.spi, name)
  }

  disconnect = async () => {
    await this.spi.disconnect()
  }

  migrate = async (tables: Table[]) => {
    for (const table of tables) {
      const tableDb = this.table(table.name)
      if (await tableDb.exists()) {
        for (const field of table.fields) {
          await tableDb.alterField(field)
        }
      } else {
        await tableDb.create(table.fields)
      }
    }
  }
}
