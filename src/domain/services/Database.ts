import type { Table } from '@domain/entities/Table'
import { DatabaseTable, type Spi as DatabaseTableSpi } from './DatabaseTable'
import type { Logger } from './Logger'
import type { RealtimeEvent } from './Realtime'
import type { Field } from '@domain/entities/Field'
import type { Monitor } from './Monitor'

export type Driver = 'PostgreSQL' | 'SQLite'

export interface Config {
  driver: string
  url: string
}

export interface Services {
  logger: Logger
  monitor: Monitor
}

export type EventType = 'notification' | 'error'

export type ErrorEvent = { message: string }

export type NotificationEvent = RealtimeEvent

export type Query = <T>(
  text: string,
  values: (string | number | Buffer | Date)[]
) => Promise<{ rows: T[]; rowCount: number }>
export type Exec = (query: string) => Promise<void>

export interface Spi {
  table: (name: string, fields: Field[]) => DatabaseTableSpi
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  exec: Exec
  query: Query
  onError: (callback: (error: ErrorEvent) => void) => void
  onNotification: (callback: (notification: NotificationEvent) => void) => void
  setupTriggers: (tables: string[]) => Promise<void>
}

export class Database {
  public driver: Driver
  private _log: (message: string) => void

  constructor(
    private _spi: Spi,
    private _services: Services,
    config: Config
  ) {
    const { logger } = _services
    const { driver } = config
    if (driver !== 'SQLite' && driver !== 'PostgreSQL')
      throw new Error(`Database type "${driver}" is required`)
    this.driver = driver
    this._log = logger.init('database')
  }

  table = (name: string, fields: Field[]): DatabaseTable => {
    return new DatabaseTable(this._spi, this._services, { name, fields })
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
      if (error instanceof Error) {
        this._services.monitor.captureException(error)
        this._log(`error disconnecting database: ${error.message}`)
      }
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
    const sortedTables: Table[] = []
    const tableMap = new Map<string, Table>(tables.map((table) => [table.name, table]))
    const visit = (table: Table, visited: Set<string>, stack: Set<string>) => {
      if (stack.has(table.name)) {
        throw new Error(`Circular dependency detected: ${table.name}`)
      }
      if (!visited.has(table.name)) {
        stack.add(table.name)
        for (const dep of table.dependancies()) {
          if (tableMap.has(dep)) {
            visit(tableMap.get(dep)!, visited, stack)
          } else {
            throw new Error(`Dependency not found: ${dep}`)
          }
        }
        stack.delete(table.name)
        visited.add(table.name)
        sortedTables.push(table)
      }
    }
    const visited = new Set<string>()
    const stack = new Set<string>()
    for (const table of tables) {
      visit(table, visited, stack)
    }
    for (const table of [...sortedTables].reverse()) {
      await this.table(table.name, table.fields).dropView()
    }
    for (const table of sortedTables) {
      const tableDb = this.table(table.name, table.fields)
      const exists = await tableDb.exists()
      if (exists) {
        await tableDb.migrate()
      } else {
        await tableDb.create()
      }
    }
    for (const table of sortedTables) {
      await this.table(table.name, table.fields).createView()
    }

    this._log(`database migrated`)
  }

  exec = async (query: string) => {
    try {
      await this._spi.exec(query)
    } catch (error) {
      if (error instanceof Error) {
        this._services.monitor.captureException(error)
        this._log(`error executing query: ${error.message}`)
      }
    }
  }

  query = async <T>(text: string, values: (string | number | Buffer | Date)[]) => {
    try {
      return this._spi.query<T>(text, values)
    } catch (error) {
      if (error instanceof Error) {
        this._services.monitor.captureException(error)
        this._log(`error querying database: ${error.message}`)
      }
      return { rows: [], rowCount: 0 }
    }
  }

  setupTriggers = async (tables: string[]) => {
    this._log(`setting up database triggers...`)
    await this._spi.setupTriggers(tables)
  }
}
