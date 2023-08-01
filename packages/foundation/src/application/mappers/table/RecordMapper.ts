import { RecordDto } from '@application/dtos/table/RecordDto'
import { Field } from '@domain/entities/table/Field'
import { Record, RecordStatus } from '@domain/entities/table/Record'

export function mapDtoToRecord(
  table: string,
  recordDto: RecordDto,
  fields: Field[],
  status?: RecordStatus
): Record {
  return new Record(table, recordDto, fields, status)
}

export function mapRecordToDto(record: Record): RecordDto {
  const { id, created_time, last_modified_time, deleted_time, fields } = record
  return { ...fields, id, created_time, last_modified_time, deleted_time }
}
