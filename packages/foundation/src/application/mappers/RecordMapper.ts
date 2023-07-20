import { RecordDto } from '@application/dtos/RecordDto'
import { Record } from '@domain/entities/Record'

export function mapDtoToRecord(table: string, recordDto: RecordDto): Record {
  const { id, ...fields } = recordDto
  return new Record(table, fields, String(id))
}
