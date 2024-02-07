import type { ToCreate } from './record/ToCreate'
import type { Spi as DatabaseSpi } from './Database'
import type { Filter } from './filter'
import type { Persisted } from './record/Persisted'
import type { Field } from '@domain/entities/table/field'

export interface Spi {
  insert: (toCreateRecord: ToCreate) => Promise<Persisted>
  read: (filters: Filter[]) => Promise<Persisted | undefined>
  exists: () => Promise<boolean>
  create: (fields: Field[]) => Promise<void>
  fieldExists: (name: string) => Promise<boolean>
  addField: (field: Field) => Promise<void>
  alterField: (field: Field) => Promise<void>
}

export class DatabaseTable {
  private table: Spi

  constructor(
    private spi: DatabaseSpi,
    private name: string
  ) {
    this.table = spi.table(name)
  }

  async insert(toCreateRecord: ToCreate) {
    const { logger } = this.spi.params
    const persistedRecord = await this.table.insert(toCreateRecord)
    logger.log(
      `inserted in ${this.name} ${JSON.stringify(persistedRecord.data, null, 2)}`
    )
    return persistedRecord
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
