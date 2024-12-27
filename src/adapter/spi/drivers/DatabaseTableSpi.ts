import { RecordMapper } from '@adapter/spi/mappers/RecordMapper'
import { FilterMapper } from '../mappers/FilterMapper'
import type { Filter, FilterDto } from '@domain/entities/Filter'
import type { IDatabaseTableSpi } from '@domain/services/DatabaseTable'
import type {
  PersistedRecordFieldsDto,
  RecordFieldsToCreateDto,
  RecordFieldsToUpdateDto,
} from '../dtos/RecordDto'
import type {
  RecordFields,
  RecordFieldsToCreate,
  RecordFieldsToUpdate,
} from '@domain/entities/Record'

export interface IDatabaseTableDriver {
  exists: () => Promise<boolean>
  create: () => Promise<void>
  dropView: () => Promise<void>
  migrate: () => Promise<void>
  createView: () => Promise<void>
  insert: <T extends RecordFields>(record: RecordFieldsToCreateDto<T>) => Promise<void>
  insertMany: <T extends RecordFields>(records: RecordFieldsToCreateDto<T>[]) => Promise<void>
  update: <T extends RecordFields>(record: RecordFieldsToUpdateDto<T>) => Promise<void>
  updateMany: <T extends RecordFields>(records: RecordFieldsToUpdateDto<T>[]) => Promise<void>
  delete: (id: string) => Promise<void>
  read: <T extends RecordFields>(
    filter: FilterDto
  ) => Promise<PersistedRecordFieldsDto<T> | undefined>
  readById: <T extends RecordFields>(id: string) => Promise<PersistedRecordFieldsDto<T> | undefined>
  list: <T extends RecordFields>(filter?: FilterDto) => Promise<PersistedRecordFieldsDto<T>[]>
}

export class DatabaseTableSpi implements IDatabaseTableSpi {
  constructor(private _driver: IDatabaseTableDriver) {}

  exists = async () => {
    return this._driver.exists()
  }

  create = async () => {
    await this._driver.create()
  }

  dropView = async () => {
    await this._driver.dropView()
  }

  migrate = async () => {
    await this._driver.migrate()
  }

  createView = async () => {
    await this._driver.createView()
  }

  insert = async <T extends RecordFields>(record: RecordFieldsToCreate<T>) => {
    await this._driver.insert(record)
  }

  insertMany = async <T extends RecordFields>(records: RecordFieldsToCreate<T>[]) => {
    await this._driver.insertMany(records)
  }

  update = async <T extends RecordFields>(record: RecordFieldsToUpdate<T>) => {
    await this._driver.update(record)
  }

  updateMany = async <T extends RecordFields>(records: RecordFieldsToUpdate<T>[]) => {
    await this._driver.updateMany(records)
  }

  delete = async (id: string) => {
    await this._driver.delete(id)
  }

  read = async <T extends RecordFields>(filter: Filter) => {
    const filterDto = FilterMapper.toDto(filter)
    const persistedRecordDto = await this._driver.read<T>(filterDto)
    if (!persistedRecordDto) return undefined
    return RecordMapper.toEntity<T>(persistedRecordDto)
  }

  readById = async <T extends RecordFields>(id: string) => {
    const persistedRecordDto = await this._driver.readById<T>(id)
    if (!persistedRecordDto) return undefined
    return RecordMapper.toEntity<T>(persistedRecordDto)
  }

  list = async <T extends RecordFields>(filter?: Filter) => {
    const persistedRecordsDtos = await this._driver.list<T>(
      filter ? FilterMapper.toDto(filter) : undefined
    )
    return RecordMapper.toManyEntity<T>(persistedRecordsDtos)
  }
}
