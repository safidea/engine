import { DatabaseTableSpi, type Driver as DatabaseTableDriver } from './DatabaseTableSpi'
import type { Event, Spi } from '@domain/services/Database'
import type { EventDto } from './dtos/EventDto'
import { EventMapper } from './mappers/EventMapper'

export interface Driver {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  table: (name: string) => DatabaseTableDriver
  exec: (query: string) => Promise<void>
  query: <T>(text: string, values: (string | number)[]) => Promise<{ rows: T[]; rowCount: number }>
  on: (event: 'notification', callback: (payload: string) => void) => void
}

export class DatabaseSpi implements Spi {
  constructor(private driver: Driver) {}

  table = (name: string) => {
    const databaseTableDriver = this.driver.table(name)
    return new DatabaseTableSpi(databaseTableDriver)
  }

  connect = async () => {
    await this.driver.connect()
  }

  disconnect = async () => {
    await this.driver.disconnect()
  }

  exec = async (query: string) => {
    await this.driver.exec(query)
  }

  query = async <T>(text: string, values: (string | number)[]) => {
    return this.driver.query<T>(text, values)
  }

  on = (event: 'notification', callback: (event: Event) => void) => {
    this.driver.on(event, (payload: string) => {
      const eventDto = JSON.parse(payload) as EventDto
      const event = EventMapper.toEntity(eventDto)
      callback(event)
    })
  }
}
