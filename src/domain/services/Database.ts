import type { Table } from '@domain/entities/Table'
import { DatabaseTable, type Spi as DatabaseTableSpi } from './DatabaseTable'
import type { Logger } from './Logger'

export interface Config {
  url: string
  type: string
}

export interface Services {
  logger: Logger
}

export interface Spi {
  table: (name: string) => DatabaseTableSpi
  disconnect: () => Promise<void>
  exec: (query: string) => Promise<unknown>
}

export class Database {
  private log: (message: string) => void

  constructor(
    private spi: Spi,
    private services: Services,
    public config: Config
  ) {
    this.log = services.logger.init('database')
  }

  table = (name: string): DatabaseTable => {
    return new DatabaseTable(this.spi, this.services, { name })
  }

  disconnect = async () => {
    const { disconnect } = this.spi
    this.log(`disconnecting database...`)
    await disconnect()
  }

  migrate = async (tables: Table[]) => {
    this.log(`migrating database...`)
    for (const table of tables) {
      const tableDb = this.table(table.name)
      if (await tableDb.exists()) {
        for (const field of table.fields) {
          const fieldExists = await tableDb.fieldExists(field.name)
          if (!fieldExists) {
            this.log(`adding field ${field.name} to table ${table.name}`)
            await tableDb.addField(field)
          }
        }
      } else {
        this.log(`creating table ${table.name}`)
        await tableDb.create(table.fields)
      }
    }
    this.log(`database migrated`)
  }

  exec = async (query: string) => {
    await this.spi.exec(query)
  }
}
