import type { CreatedRecord } from '@domain/entities/Record/Created'
import { RecordMapper } from '@adapter/spi/mappers/RecordMapper'
import { FilterMapper } from '../mappers/FilterMapper'
import type { Filter, FilterDto } from '@domain/entities/Filter'
import type { IDatabaseTableSpi } from '@domain/services/DatabaseTable'
import type { UpdatedRecord } from '@domain/entities/Record/Updated'
import type { RecordFieldsDto } from '../dtos/RecordDto'

export interface IDatabaseTableDriver {
  exists: () => Promise<boolean>
  create: () => Promise<void>
  dropView: () => Promise<void>
  migrate: () => Promise<void>
  createView: () => Promise<void>
  insert: (record: RecordFieldsDto) => Promise<void>
  insertMany: (records: RecordFieldsDto[]) => Promise<void>
  update: (record: RecordFieldsDto) => Promise<void>
  updateMany: (records: RecordFieldsDto[]) => Promise<void>
  delete: (id: string) => Promise<void>
  read: (filter: FilterDto) => Promise<RecordFieldsDto | undefined>
  readById: (id: string) => Promise<RecordFieldsDto | undefined>
  list: (filter?: FilterDto) => Promise<RecordFieldsDto[]>
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

  insert = async (createdRecord: CreatedRecord) => {
    const createdRecordDto = RecordMapper.toDto(createdRecord)
    await this._driver.insert(createdRecordDto)
  }

  insertMany = async (createdRecords: CreatedRecord[]) => {
    const createdRecordDtos = createdRecords.map(RecordMapper.toDto)
    await this._driver.insertMany(createdRecordDtos)
  }

  update = async (updatedRecord: UpdatedRecord) => {
    const updatedRecordDto = RecordMapper.toDto(updatedRecord)
    await this._driver.update(updatedRecordDto)
  }

  updateMany = async (updatedRecords: UpdatedRecord[]) => {
    const updatedRecordDtos = updatedRecords.map(RecordMapper.toDto)
    await this._driver.updateMany(updatedRecordDtos)
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
