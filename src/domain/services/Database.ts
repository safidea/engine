import type { Table } from '@domain/entities/Table'
import { DatabaseTable, type Spi as DatabaseTableSpi } from './DatabaseTable'
import type { Logger } from './Logger'
import type { RealtimePostgresEvent, RealtimeSqliteEvent } from './Realtime'

export interface Config {
  url: string
  type: string
}

export interface Services {
  logger: Logger
}

export type Event = RealtimePostgresEvent | RealtimeSqliteEvent

export interface Spi {
  table: (name: string) => DatabaseTableSpi
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  exec: (query: string) => Promise<unknown>
  query: <T>(text: string, values: (string | number)[]) => Promise<{ rows: T[]; rowCount: number }>
  on: (event: 'notification', callback: (event: Event) => void) => void
}

export class Database {
  public type: 'sqlite' | 'postgres'
  private log: (message: string) => void

  constructor(
    private spi: Spi,
    private services: Services,
    config: Config
  ) {
    const { logger } = services
    const { type } = config
    if (type !== 'sqlite' && type !== 'postgres')
      throw new Error(`Database type "${type}" is required`)
    this.type = type
    this.log = logger.init('database')
  }

  table = (name: string): DatabaseTable => {
    return new DatabaseTable(this.spi, this.services, { name })
  }

  connect = async () => {
    this.log(`connecting database...`)
    await this.spi.connect()
  }

  disconnect = async () => {
    this.log(`disconnecting database...`)
    await this.spi.disconnect()
  }

  on = (event: 'notification', callback: (event: Event) => void) => {
    this.spi.on(event, callback)
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

  query = async <T>(text: string, values: (string | number)[]) => {
    return this.spi.query<T>(text, values)
  }
}
