import type { ToCreate } from './Record/ToCreate'
import type { DatabaseSpi } from './Database'
import type { Filter } from './Filter'
import type { Persisted } from './Record/Persisted'
import type { Field } from '@domain/entities/table/Field'

export interface DatabaseTableSpi {
  insert: (toCreateRecord: ToCreate) => Promise<Persisted>
  read: (filters: Filter[]) => Promise<Persisted | undefined>
  exists: () => Promise<boolean>
  create: (fields: Field[]) => Promise<void>
  fieldExists: (name: string) => Promise<boolean>
  addField: (field: Field) => Promise<void>
  alterField: (field: Field) => Promise<void>
}

export class DatabaseTable {
  private table: DatabaseTableSpi

  constructor(spi: DatabaseSpi, name: string) {
    this.table = spi.table(name)
  }

  async insert(toCreateRecord: ToCreate) {
    return this.table.insert(toCreateRecord)
  }

  async read(filters: Filter[]) {
    return this.table.read(filters)
  }

  async exists() {
    return this.table.exists()
  }

  async create(fields: Field[]) {
    await this.table.create(fields)
  }

  async fieldExists(name: string) {
    return this.table.fieldExists(name)
  }

  async addField(field: Field) {
    await this.table.addField(field)
  }

  async alterField(field: Field) {
    await this.table.alterField(field)
  }
}
