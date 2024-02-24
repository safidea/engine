import type { Persisted } from '@domain/entities/record/Persisted'
import type { Params, Spi } from '@domain/services/Realtime'
import type { PersistedDto } from './dtos/RecordDto'
import { RecordMapper } from './mappers/RecordMapper'
import type { Table } from '@domain/engine/table/Table'

export interface Driver {
  params: Params
  connect: (tables: string[]) => Promise<void>
  disconnect: () => Promise<void>
  onInsert: (table: string, callback: (record: PersistedDto) => Promise<void>) => Promise<string>
  offInsert: (id: string) => Promise<void>
}

export class RealtimeSpi implements Spi {
  constructor(private driver: Driver) {}

  get params() {
    return this.driver.params
  }

  connect = async (tables: Table[]) => {
    const tablesNames = tables.map((table) => table.name)
    await this.driver.connect(tablesNames)
  }

  disconnect = async () => {
    await this.driver.disconnect()
  }

  onInsert = async (table: string, callback: (record: Persisted) => Promise<void>) => {
    return this.driver.onInsert(table, async (record: PersistedDto) => {
      const persisted = RecordMapper.toPersistedEntity(record)
      await callback(persisted)
    })
  }

  offInsert = async (id: string) => {
    await this.driver.offInsert(id)
  }
}
