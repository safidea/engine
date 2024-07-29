import { DatabaseTableSpi, type Driver as DatabaseTableDriver } from './DatabaseTableSpi'
import type { ErrorEvent, EventType, NotificationEvent, Spi } from '@domain/services/Database'
import type { EventDto } from './dtos/EventDto'
import { EventMapper } from './mappers/EventMapper'

export interface Driver {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  table: (name: string) => DatabaseTableDriver
  exec: (query: string) => Promise<void>
  query: <T>(text: string, values: (string | number)[]) => Promise<{ rows: T[]; rowCount: number }>
  on: (event: EventType, callback: (eventDto: EventDto) => void) => void
}

export class DatabaseSpi implements Spi {
  constructor(private _driver: Driver) {}

  table = (name: string) => {
    const databaseTableDriver = this._driver.table(name)
    return new DatabaseTableSpi(databaseTableDriver)
  }

  connect = async () => {
    await this._driver.connect()
  }

  disconnect = async () => {
    await this._driver.disconnect()
  }

  exec = async (query: string) => {
    await this._driver.exec(query)
  }

  query = async <T>(text: string, values: (string | number)[]) => {
    return this._driver.query<T>(text, values)
  }

  onError = (callback: (error: ErrorEvent) => void) => {
    this._driver.on('error', (eventDto: EventDto) => {
      const { event } = eventDto
      if (event === 'error') {
        const error = EventMapper.toErrorEntity(eventDto)
        callback(error)
      }
    })
  }

  onNotification = (callback: (notification: NotificationEvent) => void) => {
    this._driver.on('notification', (eventDto: EventDto) => {
      const { event } = eventDto
      if (event === 'notification') {
        const notification = EventMapper.toNotificationEntity(eventDto)
        callback(notification)
      }
    })
  }
}
