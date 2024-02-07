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

  insert = async (toCreateRecord: ToCreate) => {
    const { logger } = this.spi.params
    const persistedRecord = await this.table.insert(toCreateRecord)
    logger.log(`inserted in ${this.name} ${JSON.stringify(persistedRecord.data, null, 2)}`)
    return persistedRecord
  }

  read = async (filters: Filter[]) => {
    return this.table.read(filters)
  }

  exists = async () => {
    return this.table.exists()
  }

  create = async (fields: Field[]) => {
    await this.table.create(fields)
  }

  fieldExists = async (name: string) => {
    return this.table.fieldExists(name)
  }

  addField = async (field: Field) => {
    await this.table.addField(field)
  }

  alterField = async (field: Field) => {
    await this.table.alterField(field)
  }
}
