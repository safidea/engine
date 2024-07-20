import type { Table } from '@domain/entities/Table'
import { DatabaseTable, type Spi as DatabaseTableSpi } from './DatabaseTable'
import type { Logger } from './Logger'
import type { PostgresRealtimeNotificationEvent, SqliteRealtimeNotificationEvent } from './Realtime'

export interface Config {
  url: string
  type: string
}

export interface Services {
  logger: Logger
}

export type EventType = 'notification' | 'error'

export type ErrorEvent = { message: string }

export type NotificationEvent = PostgresRealtimeNotificationEvent | SqliteRealtimeNotificationEvent

export interface Spi {
  table: (name: string) => DatabaseTableSpi
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  exec: (query: string) => Promise<unknown>
  query: <T>(text: string, values: (string | number)[]) => Promise<{ rows: T[]; rowCount: number }>
  onError: (callback: (error: ErrorEvent) => void) => void
  onNotification: (callback: (notification: NotificationEvent) => void) => void
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
    try {
      this.log(`disconnecting database...`)
      await this.spi.disconnect()
    } catch (error) {
      if (error instanceof Error) this.log(`error disconnecting database: ${error.message}`)
    }
  }

  onError = (callback: (error: ErrorEvent) => void) => {
    this.log(`listening for database errors...`)
    this.spi.onError(callback)
  }

  onNotification = (callback: (notification: NotificationEvent) => void) => {
    this.log(`listening for database notifications...`)
    this.spi.onNotification(callback)
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
    try {
      await this.spi.exec(query)
    } catch (error) {
      if (error instanceof Error) this.log(`error executing query: ${error.message}`)
    }
  }

  query = async <T>(text: string, values: (string | number)[]) => {
    try {
      return this.spi.query<T>(text, values)
    } catch (error) {
      if (error instanceof Error) this.log(`error querying database: ${error.message}`)
      return { rows: [], rowCount: 0 }
    }
  }
}
