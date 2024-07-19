import type { Event, Spi } from '@domain/services/Realtime'
import type { Table } from '@domain/entities/Table'
import type EventEmitter from 'events'
import type { EventDto } from './dtos/EventDto'
import { EventMapper } from './mappers/EventMapper'

export interface Driver {
  emitter: EventEmitter
  connect: (tables: string[]) => Promise<void>
  disconnect: () => Promise<void>
}

export class RealtimeSpi implements Spi {
  constructor(private driver: Driver) {}

  connect = async (tables: Table[]) => {
    const tablesNames = tables.map((table) => table.name)
    await this.driver.connect(tablesNames)
  }

  disconnect = async () => {
    await this.driver.disconnect()
  }

  onEvent = (callback: (event: Event) => Promise<void>) => {
    this.driver.emitter.on('EVENT', async (eventDto: EventDto) => {
      const event = EventMapper.toEventEntity(eventDto)
      await callback(event)
    })
  }
}
