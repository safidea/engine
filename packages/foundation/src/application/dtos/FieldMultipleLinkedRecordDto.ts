import { FieldDto } from './FieldDto'

export interface FieldMultipleLinkedRecordDto extends FieldDto {
  type: 'multiple_linked_records'
  table: string
}
