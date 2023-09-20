import { FilterParams } from '../../../entities/services/database/filter/FilterParams'
import { TableParams } from '@entities/app/table/TableParams'
import {
  PersistedRecordDto,
  RecordToCreateDto,
  RecordToDeleteDto,
  RecordToUpdateDto,
} from '@adapters/dtos/RecordDto'

export interface IDatabaseDriver {
  configure(tables: TableParams[]): Promise<void>
  tableExists(tableName: string): boolean
  create(table: string, record: RecordToCreateDto): Promise<PersistedRecordDto>
  createMany(table: string, records: RecordToCreateDto[]): Promise<PersistedRecordDto[]>
  update(table: string, record: RecordToUpdateDto | RecordToDeleteDto): Promise<PersistedRecordDto>
  updateMany(table: string, records: RecordToUpdateDto[] | RecordToDeleteDto[]): Promise<PersistedRecordDto[]>
  list(table: string, filters?: FilterParams[]): Promise<PersistedRecordDto[]>
  read(table: string, id: string): Promise<PersistedRecordDto | undefined>
}
