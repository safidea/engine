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
  readById: (id: string) => Promise<Persisted | undefined>
  list: (filters: Filter[]) => Promise<Persisted[]>
  exists: () => Promise<boolean>
  create: (fields: Field[]) => Promise<void>
  fieldExists: (name: string) => Promise<boolean>
  addField: (field: Field) => Promise<void>
  alterField: (field: Field) => Promise<void>
  dropField: (name: string) => Promise<void>
}

export class DatabaseTable {
  private _log: (message: string) => void
  private _table: Spi

  constructor(
    spi: DatabaseSpi,
    services: Services,
    private _config: Config
  ) {
    this._log = services.logger.init('table')
    this._table = spi.table(_config.name)
  }

  insert = async (toCreateRecord: ToCreate) => {
    const persistedRecord = await this._table.insert(toCreateRecord)
    this._log(`inserted in ${this._config.name} ${JSON.stringify(persistedRecord.data, null, 2)}`)
    return persistedRecord
  }

  update = async (toUpdateRecord: ToUpdate) => {
    const persistedRecord = await this._table.update(toUpdateRecord)
    this._log(`updated in ${this._config.name} ${JSON.stringify(persistedRecord.data, null, 2)}`)
    return persistedRecord
  }

  delete = async (filters: Filter[]) => {
    await this._table.delete(filters)
    this._log(`deleting in ${this._config.name} ${filters[0].field} ${filters[0].value}`)
  }

  read = async (filters: Filter[]) => {
    return this._table.read(filters)
  }

  readById = async (id: string) => {
    return this._table.readById(id)
  }

  list = async (filters: Filter[]) => {
    return this._table.list(filters)
  }

  exists = async () => {
    return this._table.exists()
  }

  create = async (fields: Field[]) => {
    await this._table.create(fields)
  }

  fieldExists = async (name: string) => {
    return this._table.fieldExists(name)
  }

  addField = async (field: Field) => {
    await this._table.addField(field)
  }

  alterField = async (field: Field) => {
    await this._table.alterField(field)
  }

  dropField = async (name: string) => {
    await this._table.dropField(name)
  }
}
