import { FieldDto } from './FieldDto'

export interface FieldRollupDto extends FieldDto {
  type: 'rollup'
  linked_records: string
  linked_field: string
  formula: string
  format?: 'currency'
}
