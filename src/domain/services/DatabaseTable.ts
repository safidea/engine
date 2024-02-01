import type { ToCreate } from './Record/ToCreate'
import type { DatabaseSPI } from './Database'
import type { Filter } from './Filter'
import type { Persisted } from './Record/Persisted'

export interface DatabaseTableSPI {
  insert: (toCreateRecord: ToCreate) => Promise<Persisted>
  read: (filters: Filter[]) => Promise<Persisted | undefined>
}

export class DatabaseTable {
  private table: DatabaseTableSPI

  constructor(spi: DatabaseSPI, name: string) {
    this.table = spi.table(name)
  }

  async insert(toCreateRecord: ToCreate) {
    return this.table.insert(toCreateRecord)
  }

  async read(filters: Filter[]) {
    return this.table.read(filters)
  }
}
