import type { Table } from '@domain/entities/Table'
import { DatabaseTable, type IDatabaseTableSpi } from './DatabaseTable'
import type { Logger } from './Logger'
import type { RealtimeEvent } from './Realtime'
import type { Field } from '@domain/entities/Field'
import type { Monitor } from './Monitor'
import type { IdGenerator } from './IdGenerator'

export type DatabaseDriverName = 'PostgreSQL' | 'SQLite'

export interface DatabaseConfig {
  driver: DatabaseDriverName
  url: string
}

export interface DatabaseServices {
  logger: Logger
  monitor: Monitor
  idGenerator: IdGenerator
}

export type DatabaseEventType = 'notification' | 'error'

export type DatabaseErrorEvent = Error

export type DatabaseNotificationEvent = RealtimeEvent

export type DatabaseQuery = <T>(
  text: string,
  values: (string | number | Buffer | Date)[]
) => Promise<{ rows: T[]; rowCount: number }>
export type DatabaseExec = (query: string) => Promise<void>

export interface IDatabaseSpi {
  table: (name: string, fields: Field[]) => IDatabaseTableSpi
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  exec: DatabaseExec
  query: DatabaseQuery
  onError: (callback: (error: DatabaseErrorEvent) => void) => void
  onNotification: (callback: (notification: DatabaseNotificationEvent) => void) => void
  setupTriggers: (tables: string[]) => Promise<void>
}

export class Database {
  public driver: DatabaseDriverName

  constructor(
    private _spi: IDatabaseSpi,
    private _services: DatabaseServices,
    config: DatabaseConfig
  ) {
    const { driver } = config
    this.driver = driver
  }

  table = (name: string, fields: Field[]): DatabaseTable => {
    return new DatabaseTable(this._spi, this._services, { name, fields })
  }

  connect = async () => {
    const { logger } = this._services
    logger.debug(`connecting database...`)
    await this._spi.connect()
  }

  disconnect = async () => {
    const { logger, monitor } = this._services
    try {
      logger.debug(`disconnecting database...`)
      await this._spi.disconnect()
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`when trying to disconnect database: ${error.message}`)
        monitor.captureException(error)
      } else throw error
    }
  }

  onError = (callback: (error: DatabaseErrorEvent) => void) => {
    const { logger, monitor } = this._services
    logger.debug(`listening for database error...`)
    this._spi.onError((error) => {
      logger.error(`on database error : ${error.message}`)
      monitor.captureException(error)
      callback(error)
    })
  }

  onNotification = (callback: (notification: DatabaseNotificationEvent) => void) => {
    const { logger } = this._services
    logger.debug(`listening for database notifications...`)
    this._spi.onNotification(callback)
  }

  migrate = async (tables: Table[]) => {
    const { logger } = this._services
    logger.debug(`migrating database...`)
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
  }

  exec = async (query: string) => {
    const { logger, monitor } = this._services
    try {
      await this._spi.exec(query)
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`when executing database query: ${error.message}`, { query })
        monitor.captureException(error)
      } else throw error
    }
  }

  query = async <T>(text: string, values: (string | number | Buffer | Date)[]) => {
    const { logger, monitor } = this._services
    try {
      return this._spi.query<T>(text, values)
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`when querying database: ${error.message}`, { text, values })
        monitor.captureException(error)
        return { rows: [], rowCount: 0 }
      } else throw error
    }
  }

  setupTriggers = async (tables: string[]) => {
    this._services.logger.debug(`setting up database triggers...`)
    await this._spi.setupTriggers(tables)
  }
}
