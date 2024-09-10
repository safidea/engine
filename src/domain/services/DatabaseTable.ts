import type { CreatedRecord } from '../entities/Record/Created'
import type { Spi as DatabaseSpi } from './Database'
import type { Filter } from '../entities/Filter'
import type { PersistedRecord } from '../entities/Record/Persisted'
import type { Field } from '@domain/entities/Field'
import type { UpdatedRecord } from '@domain/entities/Record/Updated'
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
  insert: (recordCreated: CreatedRecord) => Promise<void>
  insertMany: (createdRecords: CreatedRecord[]) => Promise<void>
  update: (updatedRecord: UpdatedRecord) => Promise<void>
  updateMany: (updatedRecords: UpdatedRecord[]) => Promise<void>
  delete: (filters: Filter[]) => Promise<void>
  read: (filters: Filter[]) => Promise<PersistedRecord | undefined>
  readById: (id: string) => Promise<PersistedRecord | undefined>
  list: (filters: Filter[]) => Promise<PersistedRecord[]>
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

  insert = async (RecordCreatedRecord: CreatedRecord) => {
    await this._table.insert(RecordCreatedRecord)
    const persistedRecord = await this.readByIdOrThrow(RecordCreatedRecord.id)
    this._log(
      `inserted in ${this._config.name} ${JSON.stringify(persistedRecord.toJson(), null, 2)}`
    )
    return persistedRecord
  }

  insertMany = async (createdRecords: CreatedRecord[]) => {
    await this._table.insertMany(createdRecords)
    const persistedRecords = await this.list([
      new IsAnyOf({ field: 'id', value: createdRecords.map((r) => r.id) }),
    ])
    this._log(
      `inserted in ${this._config.name} ${JSON.stringify(
        persistedRecords.map((r) => r.toJson()),
        null,
        2
      )}`
    )
    return persistedRecords
  }

  update = async (updatedRecord: UpdatedRecord) => {
    await this._table.update(updatedRecord)
    const persistedRecord = await this.readByIdOrThrow(updatedRecord.id)
    this._log(
      `updated in ${this._config.name} ${JSON.stringify(persistedRecord.toJson(), null, 2)}`
    )
    return persistedRecord
  }

  updateMany = async (updatedRecords: UpdatedRecord[]) => {
    await this._table.updateMany(updatedRecords)
    const persistedRecords = await this.list([
      new IsAnyOf({ field: 'id', value: updatedRecords.map((r) => r.id) }),
    ])
    this._log(
      `updated in ${this._config.name} ${JSON.stringify(
        persistedRecords.map((r) => r.toJson()),
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
