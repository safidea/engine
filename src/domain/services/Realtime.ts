import type { Record } from '@domain/entities/Record'
import type { Logger } from './Logger'
import type { Table } from '@domain/entities/Table'
import type { IdGenerator } from './IdGenerator'
import type { Database } from './Database'

export interface RealtimeConfig {
  driver: string
  url: string
}

export interface RealtimeServices {
  logger: Logger
  idGenerator: IdGenerator
  database: Database
}

export interface RealtimeEntities {
  tables: Table[]
}

export type RealtimeAction = 'INSERT' | 'UPDATE' | 'DELETE'

export interface RealtimeEvent {
  action: RealtimeAction
  table: string
  recordId: string
}

interface RealtimeListener {
  id: string
  action: RealtimeAction
  table: string
  callback: (record: Record) => Promise<void>
}

export class Realtime {
  private _db: Database
  private _tables: Table[]
  private _listeners: RealtimeListener[]

  constructor(
    private _services: RealtimeServices,
    _entities: RealtimeEntities
  ) {
    const { database } = _services
    const { tables } = _entities
    this._db = database
    this._listeners = []
    this._tables = tables
  }

  setup = async () => {
    this._services.logger.debug('setup realtime...')
    this._db.onNotification(this._onEvent)
    await this._db.setupTriggers(this._tables.map((t) => t.name))
    if (this._db.driver === 'PostgreSQL') {
      await this._db.exec(`LISTEN realtime`)
    }
  }

  onInsert = (table: string, callback: (record: Record) => Promise<void>) => {
    const { idGenerator, logger } = this._services
    const id = idGenerator.forListener()
    this._listeners.push({
      action: 'INSERT',
      table,
      callback,
      id,
    })
    logger.debug(`subscribed to insert events with id "${id}" on table "${table}"`)
    return id
  }

  removeListener = (id: string) => {
    this._listeners = this._listeners.filter((l) => l.id !== id)
    this._services.logger.debug(`unsubscribed from insert events with id "${id}"`)
  }

  private _onEvent = async (event: RealtimeEvent) => {
    const { action, table: tableName, recordId } = event
    this._services.logger.debug(
      `received event on table "${tableName}" with action "${action}" for record "${recordId}"`
    )
    const table = this._tables.find((t) => t.name === tableName)
    if (!table) throw new Error(`Table ${table} not found`)
    const record = await table.db.readById(recordId)
    if (!record) return
    const listeners = this._listeners.filter((l) => l.table === table.name && l.action === action)
    const promises = []
    for (const listener of listeners) {
      promises.push(listener.callback(record))
    }
    await Promise.all(promises)
  }
}
