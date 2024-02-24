import type { Persisted } from '@domain/entities/record/Persisted'
import type { Logger } from './Logger'
import type { Table } from '@domain/engine/table/Table'
import type { Database } from './Database'
import type { IdGenerator } from './IdGenerator'

export interface Params {
  logger: Logger
  database: Database
  idGenerator: IdGenerator
}

type Action = 'INSERT' | 'UPDATE' | 'DELETE'

export interface Event {
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

export interface Spi {
  params: Params
  connect: (tables: Table[]) => Promise<void>
  disconnect: () => Promise<void>
  onEvent: (callback: (event: Event) => Promise<void>) => void
}

export class Realtime {
  private listeners: Listener[]

  constructor(private spi: Spi) {
    spi.onEvent(this.executeEvent)
    this.listeners = []
  }

  get params() {
    return this.spi.params
  }

  connect = async (tables: Table[]) => {
    const { logger } = this.spi.params
    logger.log('connecting to realtime...')
    await this.spi.connect(tables)
    logger.log('connected to realtime')
  }

  disconnect = async () => {
    const { logger } = this.spi.params
    logger.log('disconnecting from realtime...')
    await this.spi.disconnect()
  }

  private executeEvent = async (event: Event) => {
    const { logger } = this.spi.params
    logger.log(
      `received event on table "${event.table}" with action "${event.action}" for record "${event.record.id}"`
    )
    const { action, table, record } = event
    const listeners = this.listeners.filter((l) => l.table === table && l.action === action)
    const promises = []
    for (const listener of listeners) {
      promises.push(listener.callback(record))
    }
    await Promise.all(promises)
  }

  onInsert = (table: string, callback: (record: Persisted) => Promise<void>) => {
    const { logger, idGenerator } = this.spi.params
    const id = idGenerator.forListener()
    this.listeners.push({
      action: 'INSERT',
      table,
      callback,
      id,
    })
    logger.log(`subscribed to insert events with id "${id}" on table "${table}"`)
    return id
  }

  removeListener = (id: string) => {
    const { logger } = this.spi.params
    this.listeners = this.listeners.filter((l) => l.id !== id)
    logger.log(`unsubscribing from insert events with id "${id}"`)
  }
}
