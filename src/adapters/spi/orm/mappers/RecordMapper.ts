import { Record } from '@entities/orm/Record'
import { RecordDto } from '@adapters/spi/orm/dtos/RecordDto'
import { Table } from '@entities/app/table/Table'
import { RecordStateType } from '@entities/orm/Record/IRecord'

export class RecordMapper {
  static toEntity(recordDto: RecordDto, table: Table, state?: RecordStateType): Record {
    return new Record(recordDto, table, state)
  }

  static toDto(record: Record): RecordDto {
    const { id } = record
    const state = record.getCurrentState()
    let recordDto: RecordDto
    if (state === 'delete') {
      recordDto = { id }
      recordDto.deleted_time = record.deleted_time
    } else {
      recordDto = { ...record.fields, id }
      if (state === 'create') recordDto.created_time = record.created_time
      else if (state === 'update') recordDto.last_modified_time = record.last_modified_time
      else if (state === 'read') {
        if (record.created_time) recordDto.created_time = record.created_time
        if (record.last_modified_time) recordDto.last_modified_time = record.last_modified_time
        if (record.deleted_time) recordDto.deleted_time = record.deleted_time
      }
    }
    return recordDto
  }

  static toEntities(recordsDto: RecordDto[], table: Table, state?: RecordStateType): Record[] {
    return recordsDto.map((recordDto) => this.toEntity(recordDto, table, state))
  }

  static toDtos(records: Record[]): RecordDto[] {
    return records.map((record) => this.toDto(record))
  }
}
