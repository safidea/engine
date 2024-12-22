export interface FieldDto {
  name: string
  type: 'TEXT' | 'TIMESTAMP' | 'NUMERIC' | 'BOOLEAN' | 'TEXT[]'
  formula?: string
  options?: string[]
  required?: boolean
  table?: string
  tableField?: string
  onMigration?: {
    replace?: string
  }
}
