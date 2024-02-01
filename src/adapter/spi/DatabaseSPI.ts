import { DatabaseTableSPI, type DatabaseTableDriver } from './DatabaseTableSPI'
import type { DatabaseSPI as IDatabaseSPI } from '@domain/services/Database'

export interface DatabaseDriver {
  disconnect: () => Promise<void>
  table: (name: string) => DatabaseTableDriver
}

export class DatabaseSPI implements IDatabaseSPI {
  constructor(private driver: DatabaseDriver) {}

  table = (name: string) => {
    const databaseTableDriver = this.driver.table(name)
    return new DatabaseTableSPI(databaseTableDriver)
  }
}
