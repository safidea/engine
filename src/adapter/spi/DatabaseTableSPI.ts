import type { ToCreate } from '@domain/services/record/ToCreate'
import { RecordMapper } from '@adapter/spi/mappers/RecordMapper'
import { DatabaseFilterMapper } from './mappers/DatabaseFilterMapper'
import type { Filter } from '@domain/services/filter'
import type { DatabaseTableFieldDto } from './dtos/DatabaseTableFieldDto'
import type { DatabaseFilterDto } from './dtos/DatabaseFilterDto'
import type { Spi } from '@domain/services/DatabaseTable'
import type { PersistedDto, ToCreateDto } from './dtos/RecordDto'
import type { Field } from '@domain/entities/table/field'
import { FieldMapper } from './mappers/FieldMapper'

export interface Driver {
  exists: () => Promise<boolean>
  create: (columns: DatabaseTableFieldDto[]) => Promise<void>
  fieldExists: (name: string) => Promise<boolean>
  addField: (column: DatabaseTableFieldDto) => Promise<void>
  alterField: (column: DatabaseTableFieldDto) => Promise<void>
  dropField: (name: string) => Promise<void>
  drop: () => Promise<void>
  insert: (record: ToCreateDto) => Promise<PersistedDto>
  read: (filters: DatabaseFilterDto[]) => Promise<PersistedDto | undefined>
}

export class DatabaseTableSpi implements Spi {
  constructor(private driver: Driver) {}

  insert = async (toCreateRecord: ToCreate) => {
    const toCreateRecordDto = RecordMapper.toCreateDto(toCreateRecord)
    const persistedRecordDto = await this.driver.insert(toCreateRecordDto)
    return RecordMapper.toPersistedService(persistedRecordDto)
  }

  read = async (filters: Filter[]) => {
    const filterDtos = DatabaseFilterMapper.toManyDtos(filters)
    const persistedRecordDto = await this.driver.read(filterDtos)
    if (!persistedRecordDto) return undefined
    return RecordMapper.toPersistedService(persistedRecordDto)
  }

  exists = async () => {
    return this.driver.exists()
  }

  create = async (fields: Field[]) => {
    const fieldsDto = FieldMapper.toManyDto(fields)
    await this.driver.create(fieldsDto)
  }

  fieldExists = async (name: string) => {
    return this.driver.fieldExists(name)
  }

  addField = async (field: Field) => {
    const fieldDto = FieldMapper.toDto(field)
    await this.driver.addField(fieldDto)
  }

  alterField = async (field: Field) => {
    const fieldDto = FieldMapper.toDto(field)
    await this.driver.alterField(fieldDto)
  }
}
