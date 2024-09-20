import type { CreatedRecord } from '@domain/entities/Record/Created'
import { RecordMapper } from '@adapter/spi/mappers/RecordMapper'
import { FilterMapper } from './mappers/FilterMapper'
import type { Filter } from '@domain/entities/Filter'
import type { FilterDto } from './dtos/FilterDto'
import type { Spi } from '@domain/services/DatabaseTable'
import type { UpdatedRecord } from '@domain/entities/Record/Updated'
import type { CreatedRecordDto, PersistedRecordDto, UpdatedRecordDto } from './dtos/RecordDto'

export interface Driver {
  exists: () => Promise<boolean>
  create: () => Promise<void>
  dropView: () => Promise<void>
  migrate: () => Promise<void>
  createView: () => Promise<void>
  insert: (record: CreatedRecordDto) => Promise<void>
  insertMany: (records: CreatedRecordDto[]) => Promise<void>
  update: (record: UpdatedRecordDto) => Promise<void>
  updateMany: (records: UpdatedRecordDto[]) => Promise<void>
  delete: (id: string) => Promise<void>
  read: (filters: FilterDto[]) => Promise<PersistedRecordDto | undefined>
  readById: (id: string) => Promise<PersistedRecordDto | undefined>
  list: (filters: FilterDto[]) => Promise<PersistedRecordDto[]>
}

export class DatabaseTableSpi implements Spi {
  constructor(private _driver: Driver) {}

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

  insert = async (createdRecord: CreatedRecord) => {
    const createdRecordDto = RecordMapper.toCreateDto(createdRecord)
    await this._driver.insert(createdRecordDto)
  }

  insertMany = async (createdRecords: CreatedRecord[]) => {
    const createdRecordDtos = createdRecords.map(RecordMapper.toCreateDto)
    await this._driver.insertMany(createdRecordDtos)
  }

  update = async (updatedRecord: UpdatedRecord) => {
    const updatedRecordDto = RecordMapper.toUpdateDto(updatedRecord)
    await this._driver.update(updatedRecordDto)
  }

  updateMany = async (updatedRecords: UpdatedRecord[]) => {
    const updatedRecordDtos = updatedRecords.map(RecordMapper.toUpdateDto)
    await this._driver.updateMany(updatedRecordDtos)
  }

  delete = async (id: string) => {
    await this._driver.delete(id)
  }

  read = async (filters: Filter[]) => {
    const filterDtos = FilterMapper.toManyDtos(filters)
    const persistedRecordDto = await this._driver.read(filterDtos)
    if (!persistedRecordDto) return undefined
    return RecordMapper.toPersistedEntity(persistedRecordDto)
  }

  readById = async (id: string) => {
    const persistedRecordDto = await this._driver.readById(id)
    if (!persistedRecordDto) return undefined
    return RecordMapper.toPersistedEntity(persistedRecordDto)
  }

  list = async (filters: Filter[]) => {
    const filterDtos = FilterMapper.toManyDtos(filters)
    const persistedRecordsDtos = await this._driver.list(filterDtos)
    return RecordMapper.toManyPersistedEntity(persistedRecordsDtos)
  }
}
