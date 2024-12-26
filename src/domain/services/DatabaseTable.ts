import type { IDatabaseSpi } from './Database'
import type { Filter } from '../entities/Filter'
import type { Field } from '@domain/entities/Field'
import type { Record, RecordFieldsToCreate, RecordFieldsToUpdate } from '@domain/entities/Record'
import type { Logger } from '@domain/services/Logger'
import { IsTextFilter } from '@domain/entities/Filter/text/Is'
import { OrFilter } from '@domain/entities/Filter/Or'
import type { RecordFields, UpdateRecordFields } from '@domain/entities/Record'
import type { IdGenerator } from './IdGenerator'

export interface DatabaseTableConfig {
  name: string
  fields: Field[]
}

export interface DatabaseTableServices {
  logger: Logger
  idGenerator: IdGenerator
}

export interface IDatabaseTableSpi {
  exists: () => Promise<boolean>
  create: () => Promise<void>
  dropView: () => Promise<void>
  migrate: () => Promise<void>
  createView: () => Promise<void>
  insert: (record: RecordFieldsToCreate) => Promise<void>
  insertMany: (records: RecordFieldsToCreate[]) => Promise<void>
  update: (record: RecordFieldsToUpdate) => Promise<void>
  updateMany: (records: RecordFieldsToUpdate[]) => Promise<void>
  delete: (id: string) => Promise<void>
  read: (filter: Filter) => Promise<Record | undefined>
  readById: (id: string) => Promise<Record | undefined>
  list: (filter?: Filter) => Promise<Record[]>
}

export class DatabaseTable {
  private readonly _name: string
  private _table: IDatabaseTableSpi
  private _logger: Logger

  constructor(
    spi: IDatabaseSpi,
    private _services: DatabaseTableServices,
    config: DatabaseTableConfig
  ) {
    const { name, fields } = config
    this._table = spi.table(name, fields)
    this._logger = _services.logger
    this._name = name
  }

  exists = async () => {
    return this._table.exists()
  }

  create = async () => {
    this._logger.debug(`creating "${this._name}"...`)
    await this._table.create()
  }

  dropView = async () => {
    this._logger.debug(`dropping view "${this._name}"...`)
    await this._table.dropView()
  }

  migrate = async () => {
    this._logger.debug(`migrating "${this._name}"...`)
    await this._table.migrate()
  }

  createView = async () => {
    this._logger.debug(`creating view "${this._name}"...`)
    await this._table.createView()
  }

  insert = async (record: RecordFields) => {
    const { idGenerator, logger } = this._services
    logger.debug(`insert in table "${this._name}"`, record)
    const id = idGenerator.forRecord()
    const created_at = new Date()
    await this._table.insert({ ...record, id, created_at })
    return this.readByIdOrThrow(id)
  }

  insertMany = async (records: RecordFields[]) => {
    const { idGenerator, logger } = this._services
    logger.debug(`insert many in table "${this._name}"`, records)
    const recordsWithId = records.map((record) => {
      const id = idGenerator.forRecord()
      const created_at = new Date()
      return { ...record, id, created_at }
    })
    await this._table.insertMany(recordsWithId)
    const filter = new OrFilter(recordsWithId.map((r) => new IsTextFilter('id', r.id)))
    return this.list(filter)
  }

  update = async (id: string, record: RecordFields) => {
    this._logger.debug(`update in table "${this._name}"`, record)
    const updated_at = new Date()
    await this._table.update({ ...record, id, updated_at })
    return this.readByIdOrThrow(id)
  }

  updateMany = async (records: UpdateRecordFields[]) => {
    this._logger.debug(
      `update many in table "${this._name}"`,
      records.map((r) => r.fields)
    )
    await this._table.updateMany(
      records.map((r) => ({ ...r.fields, id: r.id, updated_at: new Date() }))
    )
    const filter = new OrFilter(records.map((r) => new IsTextFilter('id', r.id)))
    return this.list(filter)
  }

  delete = async (id: string) => {
    this._logger.debug(`delete in table "${this._name}"`, { id })
    await this._table.delete(id)
  }

  read = async (filter: Filter) => {
    this._logger.debug(`read in table "${this._name}"`, filter)
    return this._table.read(filter)
  }

  readById = async (id: string) => {
    this._logger.debug(`read in table "${this._name}"`, { id })
    return this._table.readById(id)
  }

  readByIdOrThrow = async (id: string) => {
    const record = await this.readById(id)
    if (!record) throw new Error(`record "${id}" not found in table "${this._name}"`)
    return record
  }

  list = async (filter?: Filter) => {
    this._logger.debug(`list in table "${this._name}"`, filter)
    return this._table.list(filter)
  }
}
