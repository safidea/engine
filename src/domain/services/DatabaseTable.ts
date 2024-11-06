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
  delete: (recordId: string) => Promise<void>
  read: (filters: Filter[]) => Promise<PersistedRecord | undefined>
  readById: (id: string) => Promise<PersistedRecord | undefined>
  list: (filters: Filter[]) => Promise<PersistedRecord[]>
}

export class DatabaseTable {
  private readonly _name: string
  private _table: Spi

  constructor(
    spi: DatabaseSpi,
    private _services: Services,
    config: Config
  ) {
    const { name, fields } = config
    this._table = spi.table(name, fields)
    this._name = name
  }

  exists = async () => {
    return this._table.exists()
  }

  create = async () => {
    this._services.logger.debug(`creating "${this._name}"...`)
    await this._table.create()
  }

  dropView = async () => {
    this._services.logger.debug(`dropping view "${this._name}"...`)
    await this._table.dropView()
  }

  migrate = async () => {
    this._services.logger.debug(`migrating "${this._name}"...`)
    await this._table.migrate()
  }

  createView = async () => {
    this._services.logger.debug(`creating view "${this._name}"...`)
    await this._table.createView()
  }

  insert = async (createdRecord: CreatedRecord) => {
    this._services.logger.info(`insert in table "${this._name}"`, createdRecord.toJson())
    await this._table.insert(createdRecord)
    return this.readByIdOrThrow(createdRecord.id)
  }

  insertMany = async (createdRecords: CreatedRecord[]) => {
    this._services.logger.info(
      `insert many in table "${this._name}"`,
      createdRecords.map((r) => r.toJson())
    )
    await this._table.insertMany(createdRecords)
    return this.list([new IsAnyOf({ field: 'id', value: createdRecords.map((r) => r.id) })])
  }

  update = async (updatedRecord: UpdatedRecord) => {
    this._services.logger.info(`update in table "${this._name}"`, updatedRecord.toJson())
    await this._table.update(updatedRecord)
    return this.readByIdOrThrow(updatedRecord.id)
  }

  updateMany = async (updatedRecords: UpdatedRecord[]) => {
    this._services.logger.info(
      `update many in table "${this._name}"`,
      updatedRecords.map((r) => r.toJson())
    )
    await this._table.updateMany(updatedRecords)
    return this.list([new IsAnyOf({ field: 'id', value: updatedRecords.map((r) => r.id) })])
  }

  delete = async (id: string) => {
    this._services.logger.info(`delete in table "${this._name}"`, { id })
    await this._table.delete(id)
  }

  read = async (filters: Filter[]) => {
    this._services.logger.debug(`read in table "${this._name}"`, { filters })
    return this._table.read(filters)
  }

  readById = async (id: string) => {
    this._services.logger.debug(`read in table "${this._name}"`, { id })
    return this._table.readById(id)
  }

  readByIdOrThrow = async (id: string) => {
    const record = await this.readById(id)
    if (!record) throw new Error(`record "${id}" not found in table "${this._name}"`)
    return record
  }

  list = async (filters: Filter[]) => {
    this._services.logger.debug(`list in table "${this._name}"`, { filters })
    return this._table.list(filters)
  }
}
