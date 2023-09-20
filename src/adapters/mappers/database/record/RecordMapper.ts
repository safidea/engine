import {
  PersistedRecordDto,
  RecordBodyDto,
  RecordToCreateDto,
  RecordToDeleteDto,
  RecordToUpdateDto,
} from '@adapters/dtos/RecordDto'
import { Table } from '@entities/app/table/Table'
import { PersistedRecord } from '@entities/services/database/record/state/persisted/PersistedRecord'
import { RecordToCreate } from '@entities/services/database/record/state/toCreate/RecordToCreate'
import { RecordToDelete } from '@entities/services/database/record/state/toDelete/RecordToDelete'
import { RecordToUpdate } from '@entities/services/database/record/state/toUpdate/RecordToUpdate'

export class RecordMapper {
  static toPersisted(record: PersistedRecordDto, table: Table): PersistedRecord {
    console.log('record', JSON.stringify(record))
    return new PersistedRecord(record, table)
  }

  static toManyPersisted(records: PersistedRecordDto[], table: Table): PersistedRecord[] {
    console.log('records', JSON.stringify(records))
    return records.map((record) => this.toPersisted(record, table))
  }

  static toPersistedDto(record: PersistedRecord): PersistedRecordDto {
    return record.data()
  }

  static toManyPersistedDtos(records: PersistedRecord[]): PersistedRecordDto[] {
    return records.map((record) => this.toPersistedDto(record))
  }

  static toCreate(dto: RecordToCreateDto, table: Table): RecordToCreate {
    return new RecordToCreate(dto, table)
  }

  static toManyCreates(dtos: RecordToCreateDto[], table: Table): RecordToCreate[] {
    return dtos.map((dto) => this.toCreate(dto, table))
  }

  static toCreateDto(record: RecordToCreate): PersistedRecordDto {
    return record.data()
  }

  static toManyCreatesDtos(records: RecordToCreate[]): PersistedRecordDto[] {
    return records.map((record) => this.toCreateDto(record))
  }

  static toUpdate(
    persistedRecord: PersistedRecord,
    table: Table,
    dto: RecordBodyDto
  ): RecordToUpdate {
    return new RecordToUpdate(persistedRecord.data(), table, dto)
  }

  static toUpdateDto(record: RecordToUpdate): RecordToUpdateDto {
    return record.toUpdateData()
  }

  static toManyUpdatesDtos(records: RecordToUpdate[]): RecordToUpdateDto[] {
    return records.map((record) => this.toUpdateDto(record))
  }

  static toDeleteDto(record: RecordToDelete): RecordToDeleteDto {
    return record.toDeleteData()
  }

  static toManyDeletesDtos(records: RecordToDelete[]): RecordToDeleteDto[] {
    return records.map((record) => this.toDeleteDto(record))
  }
}
