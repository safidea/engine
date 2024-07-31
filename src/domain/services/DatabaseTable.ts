import type { ToCreate } from '../entities/Record/ToCreate'
import type { Spi as DatabaseSpi } from './Database'
import type { Filter } from '../entities/Filter'
import type { Persisted } from '../entities/Record/Persisted'
import type { Field } from '@domain/entities/Field'
import type { ToUpdate } from '@domain/entities/Record/ToUpdate'
import type { Logger } from '@domain/services/Logger'
import { IsAnyOf } from '@domain/entities/Filter/IsAnyOf'

export interface Config {
  name: string
  fields: Field[]
}

export interface Services {
  logger: Logger
}

export interface Spi {
  exists: () => Promise<boolean>
  create: () => Promise<void>
  dropView: () => Promise<void>
  migrate: () => Promise<void>
  createView: () => Promise<void>
  insert: (toCreateRecord: ToCreate) => Promise<void>
  insertMany: (toCreateRecords: ToCreate[]) => Promise<void>
  update: (toUpdateRecord: ToUpdate) => Promise<void>
  updateMany: (toUpdateRecords: ToUpdate[]) => Promise<void>
  delete: (filters: Filter[]) => Promise<void>
  read: (filters: Filter[]) => Promise<Persisted | undefined>
  readById: (id: string) => Promise<Persisted | undefined>
  list: (filters: Filter[]) => Promise<Persisted[]>
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
    this._table = spi.table(_config.name, _config.fields)
  }

  exists = async () => {
    return this._table.exists()
  }

  create = async () => {
    this._log(`creating ${this._config.name}...`)
    await this._table.create()
  }

  dropView = async () => {
    this._log(`dropping view ${this._config.name}...`)
    await this._table.dropView()
  }

  migrate = async () => {
    this._log(`migrating ${this._config.name}...`)
    await this._table.migrate()
  }

  createView = async () => {
    this._log(`creating view ${this._config.name}...`)
    await this._table.createView()
  }

  insert = async (toCreateRecord: ToCreate) => {
    await this._table.insert(toCreateRecord)
    const persistedRecord = await this.readByIdOrThrow(toCreateRecord.id)
    this._log(`inserted in ${this._config.name} ${JSON.stringify(persistedRecord.data, null, 2)}`)
    return persistedRecord
  }

  insertMany = async (toCreateRecords: ToCreate[]) => {
    await this._table.insertMany(toCreateRecords)
    const persistedRecords = await this.list([
      new IsAnyOf({ field: 'id', value: toCreateRecords.map((r) => r.id) }),
    ])
    this._log(
      `inserted in ${this._config.name} ${JSON.stringify(
        persistedRecords.map((r) => r.data),
        null,
        2
      )}`
    )
    return persistedRecords
  }

  update = async (toUpdateRecord: ToUpdate) => {
    await this._table.update(toUpdateRecord)
    const persistedRecord = await this.readByIdOrThrow(toUpdateRecord.id)
    this._log(`updated in ${this._config.name} ${JSON.stringify(persistedRecord.data, null, 2)}`)
    return persistedRecord
  }

  updateMany = async (toUpdateRecords: ToUpdate[]) => {
    await this._table.updateMany(toUpdateRecords)
    const persistedRecords = await this.list([
      new IsAnyOf({ field: 'id', value: toUpdateRecords.map((r) => r.id) }),
    ])
    this._log(
      `updated in ${this._config.name} ${JSON.stringify(
        persistedRecords.map((r) => r.data),
        null,
        2
      )}`
    )
    return persistedRecords
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

  readByIdOrThrow = async (id: string) => {
    const record = await this.readById(id)
    if (!record)
      throw new Error(`DatabaseTable: record "${id}" not found in table "${this._config.name}"`)
    return record
  }

  list = async (filters: Filter[]) => {
    return this._table.list(filters)
  }
}
