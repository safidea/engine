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
  fieldExists: (name: string) => Promise<boolean>
  addField: (column: FieldDto) => Promise<void>
  alterField: (column: FieldDto) => Promise<void>
  dropField: (name: string) => Promise<void>
  drop: () => Promise<void>
  insert: (record: ToCreateDto) => Promise<PersistedDto>
  update: (record: ToUpdateDto) => Promise<PersistedDto>
  delete: (filters: FilterDto[]) => Promise<void>
  read: (filters: FilterDto[]) => Promise<PersistedDto | undefined>
  readById: (id: string) => Promise<PersistedDto | undefined>
  list: (filters: FilterDto[]) => Promise<PersistedDto[]>
}

export class DatabaseTableSpi implements Spi {
  constructor(private _driver: Driver) {}

  insert = async (toCreateRecord: ToCreate) => {
    const toCreateRecordDto = RecordMapper.toCreateDto(toCreateRecord)
    const persistedRecordDto = await this._driver.insert(toCreateRecordDto)
    return RecordMapper.toPersistedEntity(persistedRecordDto)
  }

  update = async (toUpdateRecord: ToUpdate) => {
    const toUpdateRecordDto = RecordMapper.toUpdateDto(toUpdateRecord)
    const persistedRecordDto = await this._driver.update(toUpdateRecordDto)
    return RecordMapper.toPersistedEntity(persistedRecordDto)
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

  exists = async () => {
    return this._driver.exists()
  }

  create = async (fields: Field[]) => {
    const fieldsDto = FieldMapper.toManyDto(fields)
    await this._driver.create(fieldsDto)
  }

  fieldExists = async (name: string) => {
    return this._driver.fieldExists(name)
  }

  addField = async (field: Field) => {
    const fieldDto = FieldMapper.toDto(field)
    await this._driver.addField(fieldDto)
  }

  alterField = async (field: Field) => {
    const fieldDto = FieldMapper.toDto(field)
    await this._driver.alterField(fieldDto)
  }

  dropField = async (name: string) => {
    await this._driver.dropField(name)
  }
}
