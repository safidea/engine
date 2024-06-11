import type { Table } from '@domain/engine/table/Table'
import { DatabaseTable, type Spi as DatabaseTableSpi } from './DatabaseTable'
import type { Logger } from './Logger'

export interface Config {
  url: string
  type: 'sqlite' | 'postgres'
}

export interface Params extends Config {
  logger: Logger
}

export interface Spi {
  params: Params
  table: (name: string) => DatabaseTableSpi
  disconnect: () => Promise<void>
  exec: (query: string) => Promise<unknown>
}

export class Database {
  constructor(private spi: Spi) {}

  get params() {
    return this.spi.params
  }

  table = (name: string): DatabaseTable => {
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
          const fieldExists = await tableDb.fieldExists(field.name)
          if (!fieldExists) {
            logger.log(`adding field ${field.name} to table ${table.name}`)
            await tableDb.addField(field)
          }
        }
      } else {
        logger.log(`creating table ${table.name}`)
        await tableDb.create(table.fields)
      }
    }
    logger.log(`database migrated`)
  }

  exec = async (query: string) => {
    await this.spi.exec(query)
  }
}
