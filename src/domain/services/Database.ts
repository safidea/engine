import type { Table } from '@domain/entities/table/Table'
import { DatabaseTable, type Spi as DatabaseTableSpi } from './DatabaseTable'
import type { Logger } from './Logger'

export interface Params {
  url: string
  database: 'sqlite' | 'postgres'
  logger: Logger
}

export interface Spi {
  params: Params
  table: (name: string) => DatabaseTableSpi
  disconnect: () => Promise<void>
}

export class Database {
  constructor(private spi: Spi) {}

  table = (name: string) => {
    return new DatabaseTable(this.spi, name)
  }

  disconnect = async () => {
    const { params, disconnect } = this.spi
    const { logger } = params
    logger.log(`disconnecting database...`)
    await disconnect()
  }

  migrate = async (tables: Table[]) => {
    const { logger } = this.spi.params
    logger.log(`migrating database...`)
    for (const table of tables) {
      const tableDb = this.table(table.name)
      if (await tableDb.exists()) {
        for (const field of table.fields) {
          logger.log(`altering field ${field.name} in table ${table.name}`)
          await tableDb.alterField(field)
        }
      } else {
        logger.log(`creating table ${table.name}`)
        await tableDb.create(table.fields)
      }
    }
    logger.log(`database migrated`)
  }
}
