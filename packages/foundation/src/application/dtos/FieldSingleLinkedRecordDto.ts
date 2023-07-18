import { FieldDto } from './FieldDto'

export interface FieldSingleLinkedRecordDto extends FieldDto {
  type: 'single_linked_record'
  table: string
}
