import type { ToCreate } from '@domain/entities/Record/ToCreate'
import { RecordMapper } from '@adapter/spi/mappers/RecordMapper'
import { FilterMapper } from './mappers/FilterMapper'
import type { Filter } from '@domain/entities/Filter'
import type { FieldDto } from './dtos/FieldDto'
import type { FilterDto } from './dtos/FilterDto'
import type { Spi } from '@domain/services/DatabaseTable'
import type { PersistedDto, ToCreateDto, ToUpdateDto } from './dtos/RecordDto'
import type { Field } from '@domain/entities/Field'
import { FieldMapper } from './mappers/FieldMapper'
import type { ToUpdate } from '@domain/entities/Record/ToUpdate'

export interface Driver {
  exists: () => Promise<boolean>
  create: (columns: FieldDto[]) => Promise<void>
  migrate: (columns: FieldDto[]) => Promise<void>
  insert: (record: ToCreateDto) => Promise<void>
  insertMany: (records: ToCreateDto[]) => Promise<void>
  update: (record: ToUpdateDto) => Promise<void>
  delete: (filters: FilterDto[]) => Promise<void>
  read: (filters: FilterDto[]) => Promise<PersistedDto | undefined>
  readById: (id: string) => Promise<PersistedDto | undefined>
  list: (filters: FilterDto[]) => Promise<PersistedDto[]>
}

export class DatabaseTableSpi implements Spi {
  constructor(private _driver: Driver) {}

  exists = async () => {
    return this._driver.exists()
  }

  create = async (fields: Field[]) => {
    const fieldsDto = FieldMapper.toManyDto(fields)
    await this._driver.create(fieldsDto)
  }

  migrate = async (fields: Field[]) => {
    const fieldsDto = FieldMapper.toManyDto(fields)
    await this._driver.migrate(fieldsDto)
  }

  insert = async (toCreateRecord: ToCreate) => {
    const toCreateRecordDto = RecordMapper.toCreateDto(toCreateRecord)
    await this._driver.insert(toCreateRecordDto)
  }

  insertMany = async (toCreateRecords: ToCreate[]) => {
    const toCreateRecordDtos = toCreateRecords.map(RecordMapper.toCreateDto)
    await this._driver.insertMany(toCreateRecordDtos)
  }

  update = async (toUpdateRecord: ToUpdate) => {
    const toUpdateRecordDto = RecordMapper.toUpdateDto(toUpdateRecord)
    await this._driver.update(toUpdateRecordDto)
  }

  delete = async (filters: Filter[]) => {
    const filterDtos = FilterMapper.toManyDtos(filters)
    await this._driver.delete(filterDtos)
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
