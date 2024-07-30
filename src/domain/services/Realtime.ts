import type { Persisted } from '@domain/entities/Record/Persisted'
import type { Logger } from './Logger'
import type { Table } from '@domain/entities/Table'
import type { IdGenerator } from './IdGenerator'
import type { Database } from './Database'

export interface Config {
  type: string
  url: string
}

export interface Services {
  logger: Logger
  idGenerator: IdGenerator
  database: Database
}

export type Action = 'INSERT' | 'UPDATE' | 'DELETE'

export interface RealtimeEvent {
  action: Action
  table: string
  record: Persisted
}

interface Listener {
  id: string
  action: Action
  table: string
  callback: (record: Persisted) => Promise<void>
}

export class Realtime {
  private _db: Database
  private _log: (message: string) => void
  private _listeners: Listener[]

  constructor(private _services: Services) {
    const { logger, database } = _services
    this._db = database
    this._log = logger.init('realtime')
    this._listeners = []
  }

  setup = async (tables: Table[]) => {
    this._log('setup realtime...')
    this._db.onNotification(this._onEvent)
    await this._db.setupTriggers(tables.map((t) => t.name))
    if (this._db.type === 'postgres') {
      await this._db.exec(`LISTEN realtime`)
    }
  }

  onInsert = (table: string, callback: (record: Persisted) => Promise<void>) => {
    const { idGenerator } = this._services
    const id = idGenerator.forListener()
    this._listeners.push({
      action: 'INSERT',
      table,
      callback,
      id,
    })
    this._log(`subscribed to insert events with id "${id}" on table "${table}"`)
    return id
  }

  removeListener = (id: string) => {
    this._listeners = this._listeners.filter((l) => l.id !== id)
    this._log(`unsubscribing from insert events with id "${id}"`)
  }

  private _onEvent = async (event: RealtimeEvent) => {
    const { action, table, record } = event
    this._log(
      `received event on table "${table}" with action "${action}" for record "${record.id}"`
    )
    const listeners = this._listeners.filter((l) => l.table === table && l.action === action)
    const promises = []
    for (const listener of listeners) {
      promises.push(listener.callback(record))
    }
    await Promise.all(promises)
  }
}
