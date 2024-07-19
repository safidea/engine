import { DatabaseTableSpi, type Driver as DatabaseTableDriver } from './DatabaseTableSpi'
import type { Spi } from '@domain/services/Database'

export interface Driver {
  disconnect: () => Promise<void>
  table: (name: string) => DatabaseTableDriver
  exec: (query: string) => Promise<unknown>
}

export class DatabaseSpi implements Spi {
  constructor(private driver: Driver) {}

  table = (name: string) => {
    const databaseTableDriver = this.driver.table(name)
    return new DatabaseTableSpi(databaseTableDriver)
  }

  disconnect = async () => {
    await this.driver.disconnect()
  }

  exec = async (query: string) => {
    return this.driver.exec(query)
  }
}
