import type { Persisted } from '@domain/entities/Record/Persisted'
import type { Logger } from './Logger'
import type { Table } from '@domain/entities/Table'
import type { IdGenerator } from './IdGenerator'

export interface Config {
  type: string
  url: string
}

export interface Services {
  logger: Logger
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
  connect: (tables: Table[]) => Promise<void>
  disconnect: () => Promise<void>
  onEvent: (callback: (event: Event) => Promise<void>) => void
}

export class Realtime {
  private log: (message: string) => void
  private listeners: Listener[]

  constructor(
    private spi: Spi,
    private services: Services
  ) {
    this.log = services.logger.init('realtime')
    spi.onEvent(this.executeEvent)
    this.listeners = []
  }

  connect = async (tables: Table[]) => {
    this.log('connecting to realtime...')
    await this.spi.connect(tables)
    this.log('connected to realtime')
  }

  disconnect = async () => {
    this.log('disconnecting from realtime...')
    await this.spi.disconnect()
  }

  private executeEvent = async (event: Event) => {
    this.log(
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
    const { idGenerator } = this.services
    const id = idGenerator.forListener()
    this.listeners.push({
      action: 'INSERT',
      table,
      callback,
      id,
    })
    this.log(`subscribed to insert events with id "${id}" on table "${table}"`)
    return id
  }

  removeListener = (id: string) => {
    this.listeners = this.listeners.filter((l) => l.id !== id)
    this.log(`unsubscribing from insert events with id "${id}"`)
  }
}
