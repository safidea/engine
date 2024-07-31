export interface FieldDto {
  name: string
  type: 'TEXT' | 'TIMESTAMP' | 'NUMERIC' | 'TEXT[]'
  formula?: string
  options?: string[]
  required?: boolean
  table?: string
  tableField?: string
}
