import { DatabaseTableSpi, type DatabaseTableDriver } from './DatabaseTableSpi'
import type { DatabaseSpi as IDatabaseSpi } from '@domain/services/Database'

export interface DatabaseDriver {
  disconnect: () => Promise<void>
  table: (name: string) => DatabaseTableDriver
}

export class DatabaseSpi implements IDatabaseSpi {
  constructor(private driver: DatabaseDriver) {}

  table = (name: string) => {
    const databaseTableDriver = this.driver.table(name)
    return new DatabaseTableSpi(databaseTableDriver)
  }

  async disconnect() {
    await this.driver.disconnect()
  }
}
