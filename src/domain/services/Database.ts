import type { Table } from '@domain/entities/Table'
import { DatabaseTable, type Spi as DatabaseTableSpi } from './DatabaseTable'
import type { Logger } from './Logger'
import type { PostgresRealtimeNotificationEvent, SqliteRealtimeNotificationEvent } from './Realtime'
import { Formula } from '@domain/entities/Field/Formula'

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
  private _log: (message: string) => void

  constructor(
    private _spi: Spi,
    private _services: Services,
    config: Config
  ) {
    const { logger } = _services
    const { type } = config
    if (type !== 'sqlite' && type !== 'postgres')
      throw new Error(`Database type "${type}" is required`)
    this.type = type
    this._log = logger.init('database')
  }

  table = (name: string): DatabaseTable => {
    return new DatabaseTable(this._spi, this._services, { name })
  }

  connect = async () => {
    this._log(`connecting database...`)
    await this._spi.connect()
  }

  disconnect = async () => {
    try {
      this._log(`disconnecting database...`)
      await this._spi.disconnect()
    } catch (error) {
      if (error instanceof Error) this._log(`error disconnecting database: ${error.message}`)
    }
  }

  onError = (callback: (error: ErrorEvent) => void) => {
    this._log(`listening for database errors...`)
    this._spi.onError(callback)
  }

  onNotification = (callback: (notification: NotificationEvent) => void) => {
    this._log(`listening for database notifications...`)
    this._spi.onNotification(callback)
  }

  migrate = async (tables: Table[]) => {
    this._log(`migrating database...`)
    for (const table of tables) {
      const tableDb = this.table(table.name)
      const exists = await tableDb.exists()
      if (exists) {
        this._log(`table "${table.name}" exists`)
        const dynamicFields = table.fields.filter((field) => field instanceof Formula)
        const staticFields = table.fields.filter((field) => !(field instanceof Formula))
        for (const field of dynamicFields) {
          this._log(`dropping dynamic field "${field.name}" from table ${table.name}`)
          if (await tableDb.fieldExists(field.name)) await tableDb.dropField(field.name)
        }
        for (const field of staticFields) {
          const fieldExists = await tableDb.fieldExists(field.name)
          if (!fieldExists) {
            this._log(`adding field "${field.name}" to table ${table.name}`)
            await tableDb.addField(field)
          } else {
            this._log(`altering field "${field.name}" in table ${table.name}`)
            await tableDb.alterField(field)
          }
        }
        for (const field of dynamicFields) {
          this._log(`adding dynamic field "${field.name}" to table ${table.name}`)
          await tableDb.addField(field)
        }
      } else {
        this._log(`creating table "${table.name}"`)
        await tableDb.create(table.fields)
      }
    }
    this._log(`database migrated`)
  }

  exec = async (query: string) => {
    try {
      await this._spi.exec(query)
    } catch (error) {
      if (error instanceof Error) this._log(`error executing query: ${error.message}`)
    }
  }

  query = async <T>(text: string, values: (string | number)[]) => {
    try {
      return this._spi.query<T>(text, values)
    } catch (error) {
      if (error instanceof Error) this._log(`error querying database: ${error.message}`)
      return { rows: [], rowCount: 0 }
    }
  }
}
