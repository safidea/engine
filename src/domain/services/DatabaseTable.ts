import type { ToCreate } from '../entities/Record/ToCreate'
import type { Spi as DatabaseSpi } from './Database'
import type { Filter } from '../entities/Filter'
import type { Persisted } from '../entities/Record/Persisted'
import type { Field } from '@domain/entities/Field'
import type { ToUpdate } from '@domain/entities/Record/ToUpdate'
import type { Logger } from '@domain/services/Logger'

export interface Config {
  name: string
}

export interface Services {
  logger: Logger
}

export interface Spi {
  insert: (toCreateRecord: ToCreate) => Promise<Persisted>
  update: (toUpdateRecord: ToUpdate) => Promise<Persisted>
  delete: (filters: Filter[]) => Promise<void>
  read: (filters: Filter[]) => Promise<Persisted | undefined>
  list: (filters: Filter[]) => Promise<Persisted[]>
  exists: () => Promise<boolean>
  create: (fields: Field[]) => Promise<void>
  fieldExists: (name: string) => Promise<boolean>
  addField: (field: Field) => Promise<void>
  alterField: (field: Field) => Promise<void>
}

export class DatabaseTable {
  private log: (message: string) => void
  private table: Spi

  constructor(
    spi: DatabaseSpi,
    private services: Services,
    private config: Config
  ) {
    this.log = services.logger.init('table')
    this.table = spi.table(config.name)
  }

  insert = async (toCreateRecord: ToCreate) => {
    const persistedRecord = await this.table.insert(toCreateRecord)
    this.log(`inserted in ${this.config.name} ${JSON.stringify(persistedRecord.data, null, 2)}`)
    return persistedRecord
  }

  update = async (toUpdateRecord: ToUpdate) => {
    const persistedRecord = await this.table.update(toUpdateRecord)
    this.log(`updated in ${this.config.name} ${JSON.stringify(persistedRecord.data, null, 2)}`)
    return persistedRecord
  }

  delete = async (filters: Filter[]) => {
    await this.table.delete(filters)
    this.log(`deleting in ${this.config.name} ${filters[0].field} ${filters[0].value}`)
  }

  read = async (filters: Filter[]) => {
    return this.table.read(filters)
  }

  list = async (filters: Filter[]) => {
    return this.table.list(filters)
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
