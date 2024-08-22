import { DatabaseTableSpi, type Driver as DatabaseTableDriver } from './DatabaseTableSpi'
import type {
  ErrorEvent,
  EventType,
  Exec,
  NotificationEvent,
  Query,
  Spi,
} from '@domain/services/Database'
import type { EventDto } from './dtos/EventDto'
import { EventMapper } from './mappers/EventMapper'
import type { FieldDto } from './dtos/FieldDto'
import type { Field } from '@domain/entities/Field'
import { FieldMapper } from './mappers/FieldMapper'

export interface Driver {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  table: (name: string, fields: FieldDto[]) => DatabaseTableDriver
  exec: Exec
  query: Query
  on: (event: EventType, callback: (eventDto: EventDto) => void) => void
  setupTriggers: (tables: string[]) => Promise<void>
}

export class DatabaseSpi implements Spi {
  constructor(private _driver: Driver) {}

  table = (name: string, fields: Field[]) => {
    const fieldsDto = FieldMapper.toManyDto(fields)
    const databaseTableDriver = this._driver.table(name, fieldsDto)
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

  query = async <T>(text: string, values: (string | number | Buffer | Date)[]) => {
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

  setupTriggers = async (tables: string[]) => {
    await this._driver.setupTriggers(tables)
  }
}
