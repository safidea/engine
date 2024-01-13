import { TableList } from '@entities/app/table/TableList'
import { IDatabaseMapper } from '@entities/services/database/IDatabaseMapper'
import { PersistedRecord } from '@entities/services/database/record/state/persisted/PersistedRecord'
import { RecordToCreate } from '@entities/services/database/record/state/toCreate/RecordToCreate'
import { RecordToDelete } from '@entities/services/database/record/state/toDelete/RecordToDelete'
import { RecordToUpdate } from '@entities/services/database/record/state/toUpdate/RecordToUpdate'
import { IDatabaseDriver } from './IDatabaseDriver'
import { FilterMapper } from './filter/FilterMapper'
import { RecordMapper } from './record/RecordMapper'
import { Table } from '@entities/app/table/Table'
import { Filter } from '@entities/services/database/filter/Filter'

export class DatabaseMapper implements IDatabaseMapper {
  constructor(private readonly driver: IDatabaseDriver) {}

  async configure(tables: TableList): Promise<void> {
    await this.driver.configure(tables.getAllParams())
  }

  async tableExists(table: string): Promise<boolean> {
    return this.driver.tableExists(table)
  }

  async create(table: Table, record: RecordToCreate): Promise<PersistedRecord> {
    const recordDto = RecordMapper.toCreateDto(record)
    const persistedRecordDto = await this.driver.create(table.name, recordDto)
    return RecordMapper.toPersisted(persistedRecordDto, table)
  }

  async createMany(table: Table, records: RecordToCreate[]): Promise<PersistedRecord[]> {
    const recordsDtos = RecordMapper.toManyCreatesDtos(records)
    const persistedRecordsDtos = await this.driver.createMany(table.name, recordsDtos)
    return RecordMapper.toManyPersisted(persistedRecordsDtos, table)
  }

  async softUpdate(table: Table, record: RecordToUpdate): Promise<PersistedRecord> {
    const recordDto = RecordMapper.toUpdateDto(record)
    const persistedRecordDto = await this.driver.update(table.name, recordDto)
    return RecordMapper.toPersisted(persistedRecordDto, table)
  }

  async softUpdateMany(table: Table, records: RecordToUpdate[]): Promise<PersistedRecord[]> {
    const recordsDtos = RecordMapper.toManyUpdatesDtos(records)
    const persistedRecordsDtos = await this.driver.updateMany(table.name, recordsDtos)
    return RecordMapper.toManyPersisted(persistedRecordsDtos, table)
  }

  async softDelete(table: Table, record: RecordToDelete): Promise<PersistedRecord> {
    const recordDto = RecordMapper.toDeleteDto(record)
    const persistedRecordDto = await this.driver.update(table.name, recordDto)
    return RecordMapper.toPersisted(persistedRecordDto, table)
  }

  async softDeleteMany(table: Table, records: RecordToDelete[]): Promise<PersistedRecord[]> {
    const recordsDtos = RecordMapper.toManyDeletesDtos(records)
    const persistedRecordsDtos = await this.driver.updateMany(table.name, recordsDtos)
    return RecordMapper.toManyPersisted(persistedRecordsDtos, table)
  }

  async list(table: Table, filters: Filter[]): Promise<PersistedRecord[]> {
    const filtersDtos = FilterMapper.toManyDtos(filters)
    const recordsDtos = await this.driver.list(table.name, filtersDtos)
    return RecordMapper.toManyPersisted(recordsDtos, table)
  }

  async read(table: Table, id: string): Promise<PersistedRecord | undefined> {
    const recordDto = await this.driver.read(table.name, id)
    if (!recordDto) return undefined
    return RecordMapper.toPersisted(recordDto, table)
  }
}
