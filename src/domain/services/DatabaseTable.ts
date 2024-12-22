import type { CreatedRecord } from '../entities/Record/Created'
import type { IDatabaseSpi } from './Database'
import type { Filter } from '../entities/Filter'
import type { PersistedRecord } from '../entities/Record/Persisted'
import type { Field } from '@domain/entities/Field'
import type { UpdatedRecord } from '@domain/entities/Record/Updated'
import type { Logger } from '@domain/services/Logger'
import { IsTextFilter } from '@domain/entities/Filter/text/Is'
import { OrFilter } from '@domain/entities/Filter/Or'

export interface DatabaseTableConfig {
  name: string
  fields: Field[]
}

export interface DatabaseTableServices {
  logger: Logger
}

export interface IDatabaseTableSpi {
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
  read: (filter: Filter) => Promise<PersistedRecord | undefined>
  readById: (id: string) => Promise<PersistedRecord | undefined>
  list: (filter?: Filter) => Promise<PersistedRecord[]>
}

export class DatabaseTable {
  private readonly _name: string
  private _table: IDatabaseTableSpi

  constructor(
    spi: IDatabaseSpi,
    private _services: DatabaseTableServices,
    config: DatabaseTableConfig
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
    this._services.logger.debug(`insert in table "${this._name}"`, createdRecord.fields)
    await this._table.insert(createdRecord)
    return this.readByIdOrThrow(createdRecord.id)
  }

  insertMany = async (createdRecords: CreatedRecord[]) => {
    this._services.logger.debug(
      `insert many in table "${this._name}"`,
      createdRecords.map((r) => r.fields)
    )
    await this._table.insertMany(createdRecords)
    const filter = new OrFilter(createdRecords.map((r) => new IsTextFilter('id', r.id)))
    return this.list(filter)
  }

  update = async (updatedRecord: UpdatedRecord) => {
    this._services.logger.debug(`update in table "${this._name}"`, updatedRecord.fields)
    await this._table.update(updatedRecord)
    return this.readByIdOrThrow(updatedRecord.id)
  }

  updateMany = async (updatedRecords: UpdatedRecord[]) => {
    this._services.logger.debug(
      `update many in table "${this._name}"`,
      updatedRecords.map((r) => r.fields)
    )
    await this._table.updateMany(updatedRecords)
    const filter = new OrFilter(updatedRecords.map((r) => new IsTextFilter('id', r.id)))
    return this.list(filter)
  }

  delete = async (id: string) => {
    this._services.logger.debug(`delete in table "${this._name}"`, { id })
    await this._table.delete(id)
  }

  read = async (filter: Filter) => {
    this._services.logger.debug(`read in table "${this._name}"`, filter)
    return this._table.read(filter)
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

  list = async (filter?: Filter) => {
    this._services.logger.debug(`list in table "${this._name}"`, filter)
    return this._table.list(filter)
  }
}
