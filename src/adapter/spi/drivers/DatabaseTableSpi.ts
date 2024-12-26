import { RecordMapper } from '@adapter/spi/mappers/RecordMapper'
import { FilterMapper } from '../mappers/FilterMapper'
import type { Filter, FilterDto } from '@domain/entities/Filter'
import type { IDatabaseTableSpi } from '@domain/services/DatabaseTable'
import type {
  PersistedRecordFieldsDto,
  RecordFieldsToCreateDto,
  RecordFieldsToUpdateDto,
} from '../dtos/RecordDto'
import type { RecordFieldsToCreate, RecordFieldsToUpdate } from '@domain/entities/Record'

export interface IDatabaseTableDriver {
  exists: () => Promise<boolean>
  create: () => Promise<void>
  dropView: () => Promise<void>
  migrate: () => Promise<void>
  createView: () => Promise<void>
  insert: (record: RecordFieldsToCreateDto) => Promise<void>
  insertMany: (records: RecordFieldsToCreateDto[]) => Promise<void>
  update: (record: RecordFieldsToUpdateDto) => Promise<void>
  updateMany: (records: RecordFieldsToUpdateDto[]) => Promise<void>
  delete: (id: string) => Promise<void>
  read: (filter: FilterDto) => Promise<PersistedRecordFieldsDto | undefined>
  readById: (id: string) => Promise<PersistedRecordFieldsDto | undefined>
  list: (filter?: FilterDto) => Promise<PersistedRecordFieldsDto[]>
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

  insert = async (record: RecordFieldsToCreate) => {
    await this._driver.insert(record)
  }

  insertMany = async (records: RecordFieldsToCreate[]) => {
    await this._driver.insertMany(records)
  }

  update = async (record: RecordFieldsToUpdate) => {
    await this._driver.update(record)
  }

  updateMany = async (records: RecordFieldsToUpdate[]) => {
    await this._driver.updateMany(records)
  }

  delete = async (id: string) => {
    await this._driver.delete(id)
  }

  read = async (filter: Filter) => {
    const filterDto = FilterMapper.toDto(filter)
    const persistedRecordDto = await this._driver.read(filterDto)
    if (!persistedRecordDto) return undefined
    return RecordMapper.toEntity(persistedRecordDto)
  }

  readById = async (id: string) => {
    const persistedRecordDto = await this._driver.readById(id)
    if (!persistedRecordDto) return undefined
    return RecordMapper.toEntity(persistedRecordDto)
  }

  list = async (filter?: Filter) => {
    const persistedRecordsDtos = await this._driver.list(
      filter ? FilterMapper.toDto(filter) : undefined
    )
    return RecordMapper.toManyEntity(persistedRecordsDtos)
  }
}
