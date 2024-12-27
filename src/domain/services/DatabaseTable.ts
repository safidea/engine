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
  insert: <T extends RecordFields>(record: RecordFieldsToCreate<T>) => Promise<void>
  insertMany: <T extends RecordFields>(records: RecordFieldsToCreate<T>[]) => Promise<void>
  update: <T extends RecordFields>(record: RecordFieldsToUpdate<T>) => Promise<void>
  updateMany: <T extends RecordFields>(records: RecordFieldsToUpdate<T>[]) => Promise<void>
  delete: (id: string) => Promise<void>
  read: <T extends RecordFields>(filter: Filter) => Promise<Record<T> | undefined>
  readById: <T extends RecordFields>(id: string) => Promise<Record<T> | undefined>
  list: <T extends RecordFields>(filter?: Filter) => Promise<Record<T>[]>
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

  insert = async <T extends RecordFields>(record: T) => {
    const { idGenerator, logger } = this._services
    logger.debug(`insert in table "${this._name}"`, record)
    const id = idGenerator.forRecord()
    const created_at = new Date()
    await this._table.insert<T>({ fields: record, id, created_at })
    return this.readByIdOrThrow<T>(id)
  }

  insertMany = async <T extends RecordFields>(records: T[]) => {
    const { idGenerator, logger } = this._services
    logger.debug(`insert many in table "${this._name}"`, records)
    const recordsWithId = records.map((fields) => {
      const id = idGenerator.forRecord()
      const created_at = new Date()
      return { fields, id, created_at }
    })
    await this._table.insertMany<T>(recordsWithId)
    const filter = new OrFilter(recordsWithId.map((r) => new IsTextFilter('id', r.id)))
    return this.list<T>(filter)
  }

  update = async <T extends RecordFields>(id: string, record: Partial<T>) => {
    this._logger.debug(`update in table "${this._name}"`, record)
    const updated_at = new Date()
    await this._table.update<T>({ fields: record, id, updated_at })
    return this.readByIdOrThrow<T>(id)
  }

  updateMany = async <T extends RecordFields>(records: UpdateRecordFields<T>[]) => {
    this._logger.debug(
      `update many in table "${this._name}"`,
      records.map((r) => r.fields)
    )
    const updated_at = new Date()
    await this._table.updateMany<T>(
      records.map((r) => ({ fields: r.fields, id: r.id, updated_at }))
    )
    const filter = new OrFilter(records.map((r) => new IsTextFilter('id', r.id)))
    return this.list<T>(filter)
  }

  delete = async (id: string) => {
    this._logger.debug(`delete in table "${this._name}"`, { id })
    await this._table.delete(id)
  }

  read = async <T extends RecordFields>(filter: Filter) => {
    this._logger.debug(`read in table "${this._name}"`, filter)
    return this._table.read<T>(filter)
  }

  readById = async <T extends RecordFields>(id: string) => {
    this._logger.debug(`read in table "${this._name}"`, { id })
    return this._table.readById<T>(id)
  }

  readByIdOrThrow = async <T extends RecordFields>(id: string) => {
    const record = await this.readById<T>(id)
    if (!record) throw new Error(`record "${id}" not found in table "${this._name}"`)
    return record
  }

  list = async <T extends RecordFields>(filter?: Filter) => {
    this._logger.debug(`list in table "${this._name}"`, filter)
    return this._table.list<T>(filter)
  }
}
