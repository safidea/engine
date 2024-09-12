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
  private readonly _name: string
  private _log: (message: string) => void
  private _table: Spi

  constructor(
    spi: DatabaseSpi,
    services: Services,
    private _config: Config
  ) {
    const { name, fields } = _config
    this._log = services.logger.init('table')
    this._table = spi.table(name, fields)
    this._name = name
  }

  exists = async () => {
    return this._table.exists()
  }

  create = async () => {
    this._log(`creating "${this._name}"...`)
    await this._table.create()
  }

  dropView = async () => {
    this._log(`dropping view "${this._name}"...`)
    await this._table.dropView()
  }

  migrate = async () => {
    this._log(`migrating "${this._name}"...`)
    await this._table.migrate()
  }

  createView = async () => {
    this._log(`creating view "${this._name}"...`)
    await this._table.createView()
  }

  insert = async (createdRecord: CreatedRecord) => {
    this._log(
      `inserting record in "${this._name}" ${JSON.stringify(createdRecord.toJson(), null, 2)}`
    )
    await this._table.insert(createdRecord)
    return this.readByIdOrThrow(createdRecord.id)
  }

  insertMany = async (createdRecords: CreatedRecord[]) => {
    this._log(
      `inserting records in "${this._name}" ${JSON.stringify(
        createdRecords.map((r) => r.toJson()),
        null,
        2
      )}`
    )
    await this._table.insertMany(createdRecords)
    return this.list([new IsAnyOf({ field: 'id', value: createdRecords.map((r) => r.id) })])
  }

  update = async (updatedRecord: UpdatedRecord) => {
    this._log(
      `updating record in "${this._name}" ${JSON.stringify(updatedRecord.toJson(), null, 2)}`
    )
    await this._table.update(updatedRecord)
    return this.readByIdOrThrow(updatedRecord.id)
  }

  updateMany = async (updatedRecords: UpdatedRecord[]) => {
    this._log(
      `updating records in "${this._name}" ${JSON.stringify(
        updatedRecords.map((r) => r.toJson()),
        null,
        2
      )}`
    )
    await this._table.updateMany(updatedRecords)
    return this.list([new IsAnyOf({ field: 'id', value: updatedRecords.map((r) => r.id) })])
  }

  delete = async (filters: Filter[]) => {
    this._log(`deleting record in ${this._name} ${JSON.stringify(filters, null, 2)}`)
    await this._table.delete(filters)
  }

  read = async (filters: Filter[]) => {
    this._log(`reading record in ${this._name} ${JSON.stringify(filters, null, 2)}`)
    return this._table.read(filters)
  }

  readById = async (id: string) => {
    this._log(`reading record in ${this._name} ${id}`)
    return this._table.readById(id)
  }

  readByIdOrThrow = async (id: string) => {
    const record = await this.readById(id)
    if (!record) throw new Error(`DatabaseTable: record "${id}" not found in table "${this._name}"`)
    return record
  }

  list = async (filters: Filter[]) => {
    this._log(`listing records in ${this._name} ${JSON.stringify(filters, null, 2)}`)
    return this._table.list(filters)
  }
}
