import type { ToCreateRecord } from './record/ToCreateRecord'
import type { DatabaseSPI } from './Database'
import type { Filter } from './filter'
import type { PersistedRecord } from './record/PersistedRecord'

export interface DatabaseTableSPI {
  insert: (toCreateRecord: ToCreateRecord) => Promise<PersistedRecord>
  read: (filters: Filter[]) => Promise<PersistedRecord | undefined>
}

export class DatabaseTable {
  private table: DatabaseTableSPI

  constructor(spi: DatabaseSPI, name: string) {
    this.table = spi.table(name)
  }

  async insert(toCreateRecord: ToCreateRecord) {
    return this.table.insert(toCreateRecord)
  }
}
