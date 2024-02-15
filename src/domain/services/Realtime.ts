import type { Persisted } from '@domain/entities/record/Persisted'
import type { Logger } from './Logger'
import type { Table } from '@domain/engine/table/Table'
import type { Database } from './Database'

export interface Params {
  logger: Logger
  database: Database
}

export interface Spi {
  params: Params
  connect: (tables: Table[]) => Promise<void>
  disconnect: () => Promise<void>
  onInsert: (table: string, callback: (record: Persisted) => Promise<void>) => Promise<string>
}

export class Realtime {
  constructor(private spi: Spi) {}

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

  onInsert = async (tableName: string, callback: (record: Persisted) => Promise<void>) => {
    return this.spi.onInsert(tableName, callback)
  }
}
