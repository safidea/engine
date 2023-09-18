import { PersistedRecordDto, RecordToCreateDto, RecordToUpdateDto } from '@adapters/dtos/RecordDto'
import { Table } from '@entities/app/table/Table'
import { PersistedRecord } from '@entities/services/database/record/state/persisted/PersistedRecord'
import { RecordToCreate } from '@entities/services/database/record/state/toCreate/RecordToCreate'
import { RecordToUpdate } from '@entities/services/database/record/state/toUpdate/RecordToUpdate'

export class RecordMapper {
  static toCreate(dto: RecordToCreateDto, table: Table): RecordToCreate {
    return new RecordToCreate(dto, table)
  }

  static toManyCreates(dtos: RecordToCreateDto[], table: Table): RecordToCreate[] {
    return dtos.map((dto) => this.toCreate(dto, table))
  }

  static toUpdate(
    persistedRecord: PersistedRecord,
    table: Table,
    dto: RecordToUpdateDto
  ): RecordToUpdate {
    return new RecordToUpdate(persistedRecord.data(), table, dto)
  }

  static toDto(record: PersistedRecord): PersistedRecordDto {
    return record.data()
  }

  static toManyDtos(records: PersistedRecord[]): PersistedRecordDto[] {
    return records.map((record) => this.toDto(record))
  }
}
